import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { SignJWT, jwtDecrypt, JWTPayload, EncryptJWT } from 'jose'
import {
  UserGenders,
  UserJobs,
  UserLogStatus,
  UserRoles
} from '../enums/user.enums'
import { sessionRepository } from '../repositories/session.repository'

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
  const { payload } = await jwtDecrypt(token, sessionSecret)
  return payload
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
