import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { sign, verify, decode } from 'jsonwebtoken'
import { SignJWT, jwtDecrypt, JWTPayload, EncryptJWT, jwtVerify } from 'jose'
import {
  UserGenders,
  UserJobs,
  UserLogStatus,
  UserRoles
} from '../enums/user.enums'
import { sessionRepository } from '../repositories/session.repository'
import { sendEmail } from '../services/mailerConfig'
import { tokenRepository } from '../repositories/token.repository'
import { TokenTypes } from '../enums/token.enums'
import { Token } from '../entities/Token'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET
const sessionSecret = new TextEncoder().encode(process.env.SESSION_SECRET)

const encryptSessionData = async (sessionData: string): Promise<string> => {
  const encryptedSessionData = await new EncryptJWT({ data: sessionData })
    .setProtectedHeader({ alg: 'HS256', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .encrypt(sessionSecret)
  return encryptedSessionData
}

const signTokenizedSessionData = async (
  tokenSessionData: string
): Promise<string> => {
  const signedTokenizedSession = new SignJWT({ data: tokenSessionData }).sign(
    new TextEncoder().encode(tokenSecret)
  )

  return signedTokenizedSession
}

// Helper function to decrypt the session data
const decryptSessionData = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, sessionSecret)
  if (!payload) return null
  return payload
}

const sendVerificationLink = async (email: string) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    if (!user) return null
    const userVerificationToken = user.tokens.filter(
      (token) => token.tokenType === TokenTypes.VERIFYEMAIL
    )
    if (!userVerificationToken) return null
    const verifyUrl = `http://localhost/v1/verify/id:${userVerificationToken}`
    await sendEmail(
      email,
      'Sports club email verification',
      `The following link is a one time link and is available for 3 minutes, carefully use it to validate your email: ${verifyUrl}.`
    )
  } catch (error) {
    console.log(error)
    return null
  }
}

export const verifyEmail = async (userVerificationToken: string) => {
  try {
    let userId = ''
    let userEmail = ''
    if (!userVerificationToken) return null
    let tokenVerificationResults = verify(userVerificationToken, tokenSecret)
    if (!tokenVerificationResults) return null

    if (typeof tokenVerificationResults !== 'string') {
      userId = tokenVerificationResults.userId
      userEmail = tokenVerificationResults.userEmail
    }
    await userRepository.makeUserEmailVertified(userId, userEmail)
    const user = await userRepository.findUserByEmail(userEmail)
    await tokenRepository.delete({
      user,
      tokenBody: userVerificationToken
    })
  } catch (error) {
    console.log(error)
    return null
  }
}

const login = async (email: string, phone: string, password: string) => {
  let dbUser: User
  if (email) {
    let dbUser = await userRepository.findUserByEmail(email)
    if (!dbUser) return null
  }
  if (phone) {
    let dbUser = await userRepository.findUserByPhone(phone)
    if (!dbUser) return null
  }

  const compareCheck = await bcrypt.compare(dbUser.password, password)
  if (!compareCheck) return null

  const encryptedSessionData = await encryptSessionData(
    JSON.stringify({ status: UserLogStatus.LOGGEDIN })
  )
  const signedEncryptedSessionData = await signTokenizedSessionData(
    encryptedSessionData
  )
  const newSession = await sessionRepository.createSession(
    dbUser,
    24 * 60 * 60 * 1000,
    signedEncryptedSessionData
  )

  return {
    user: dbUser,
    session: newSession
  }
}

const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  gender: UserGenders,
  dob: string,
  job: UserJobs
) => {
  try {
    let dbUser: User
    dbUser = await userRepository.findUserByEmail(email)
    if (dbUser) return null
    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) return null

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await userRepository.createUser(
      firstName,
      lastName,
      gender,
      email,
      phone,
      hashedPassword,
      UserRoles.USER,
      dob,
      job
    )

    const verificationToken = sign(
      { userId: newUser.userId, userEmail: newUser.email },
      tokenSecret,
      {
        expiresIn: '3m'
      }
    )

    await tokenRepository.createToken(
      newUser,
      '3m',
      verificationToken,
      TokenTypes.VERIFYEMAIL,
      1
    )

    await sendVerificationLink(newUser.email)

    const encryptedSessionData = await encryptSessionData(
      JSON.stringify({ status: UserLogStatus.LOGGEDIN })
    )
    const signedEncryptedSessionData = await signTokenizedSessionData(
      encryptedSessionData
    )
    const newSession = await sessionRepository.createSession(
      newUser,
      24 * 60 * 60 * 1000,
      signedEncryptedSessionData
    )

    return {
      user: newUser,
      session: newSession
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

const logOut = async (id: number) => {
  const user = await userRepository.findUserById(id)
  if (!user) return null
  await sessionRepository.delete({
    user: user
  })
}

const signInWithGoogle = async () => {}

export { signUp, login, logOut }
