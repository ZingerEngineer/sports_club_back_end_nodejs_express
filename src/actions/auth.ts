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
import {
  addMinutesToDate,
  getMssqlUTCTimeStamp
} from '../utils/generateIncomingUTCDate'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

const signSessionData = async (sessionData: string): Promise<string> => {
  const signedSessionData = sign(sessionData, tokenSecret)
  return signedSessionData
}

const sendVerificationLink = async (email: string) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    if (!user) throw new Error('Creating email verification failed due to user')

    const userVerificationToken = user.tokens.filter(
      (token) => token.tokenType === TokenTypes.VERIFYEMAIL
    )[0].tokenBody
    if (!userVerificationToken)
      throw new Error('Creating email verification failed')
    const verifyUrl = `http://localhost/v1/verify/email?vt=${userVerificationToken}`
    const res = await sendEmail(
      email,
      'Sports club email verification',
      `The following link is a one time link and is available for 3 minutes, carefully use it to validate your email: ${verifyUrl}.`
    )
    console.log(res)
  } catch (error) {
    console.log(error)
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

    const newSignedSessionData = await signSessionData(
      JSON.stringify({ status: UserLogStatus.LOGGEDIN })
    )
    const newSessionExpirationDate = getMssqlUTCTimeStamp(
      addMinutesToDate(new Date(), 24 * 60)
    )
    const newSession = await sessionRepository.createSession(
      dbUser,
      newSessionExpirationDate,
      newSignedSessionData
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
    if (dbUser) {
      throw new Error('Signup failed')
    }
    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) {
      throw new Error('Signup failed')
    }

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
      getMssqlUTCTimeStamp(addMinutesToDate(new Date(), 3)),
      verificationToken,
      TokenTypes.VERIFYEMAIL,
      1
    )

    await sendVerificationLink(newUser.email)

    const newSignedSessionData = await signSessionData(
      JSON.stringify({
        status: UserLogStatus.LOGGEDIN
      })
    )
    const newSessionExpirationDate = getMssqlUTCTimeStamp(
      addMinutesToDate(new Date(), 60 * 24)
    )
    const newSession = await sessionRepository.createSession(
      newUser,
      newSessionExpirationDate,
      newSignedSessionData
    )
    console.log({ newlyCreatedSessionTimeStamp: newSessionExpirationDate })
    console.log({ newlyCreatedSession: newSession })

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
