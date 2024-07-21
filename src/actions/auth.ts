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
    if (!user) throw new Error('Creating email verification failed')
    const userVerificationToken = user.tokens.filter(
      (token) => token.tokenType === TokenTypes.VERIFYEMAIL
    )
    if (!userVerificationToken)
      throw new Error('Creating email verification failed')
    const verifyUrl = `http://localhost/v1/verify/email?vt=${userVerificationToken}`
    await sendEmail(
      email,
      'Sports club email verification',
      `The following link is a one time link and is available for 3 minutes, carefully use it to validate your email: ${verifyUrl}.`
    )
  } catch (error) {
    throw new Error('Creating email verification failed')
  }
}

export const verifyEmail = async (userVerificationToken: string) => {
  try {
    let userId = ''
    let userEmail = ''
    if (!userVerificationToken) throw new Error('Invaid token')
    let tokenVerificationResults = verify(userVerificationToken, tokenSecret)
    if (!tokenVerificationResults) throw new Error('Invalid token')

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
    throw new Error('Invaid token')
  }
}

const login = async (email: string, phone: string, password: string) => {
  try {
    let dbUser: User
    if (email) {
      dbUser = await userRepository.findUserByEmail(email)
    }
    if (phone) {
      dbUser = await userRepository.findUserByPhone(phone)
    }
    if (!dbUser) throw new Error('Login failed')
    const passCompareCheck = await bcrypt.compare(dbUser.password, password)
    if (!passCompareCheck) throw new Error('Login failed')

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
  } catch (error) {
    throw new Error('Login failed')
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
    if (dbUser) throw new Error('Signup failed')
    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) throw new Error('Signup failed')

    const newUser = await userRepository.createUser(
      firstName,
      lastName,
      gender,
      email,
      phone,
      password,
      UserRoles.USER,
      dob,
      job
    )

    const verificationToken = sign(
      {
        userId: newUser.userId,
        userRole: newUser.role,
        userEmail: newUser.email
      },
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
    throw new Error('Signup failed')
  }
}

const logOut = async (id: number) => {
  try {
    const user = await userRepository.findUserById(id)
    if (!user) throw new Error('Logout failed')
    await sessionRepository.delete({
      user: user
    })
  } catch (error) {
    throw new Error('Logout failed')
  }
}

const signInWithGoogle = async () => {}

export { signUp, login, logOut }
