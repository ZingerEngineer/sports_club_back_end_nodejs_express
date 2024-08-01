import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { sign, verify, decode } from 'jsonwebtoken'
import {
  UserEmailVerificationState,
  UserGenders,
  UserJobs,
  UserLogStatus,
  UserRoles
} from '../enums/user.enums'
import { sessionRepository } from '../repositories/session.repository'
import { sendEmail } from '../services/mailerConfig'
import { tokenRepository } from '../repositories/token.repository'
import { TokenTypes } from '../enums/token.enums'
import { addMinutesToDate } from '../utils/addMinutesToDate'
import axios from 'axios'
import {
  getGoogleOAuthTokens,
  getGoogleUser
} from '../services/google.oauth.services'
import { userInfo } from 'os'
import { Token } from '../entities/Token'
import { Session } from 'inspector'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

const signSessionData = async (sessionData: string): Promise<string> => {
  const signedSessionData = sign(sessionData, tokenSecret)
  return signedSessionData
}

const sendVerificationLink = async (email: string) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    if (!user) throw new Error('User not found')

    const userVerificationToken = user.tokens.filter(
      (token) => token.tokenType === TokenTypes.VERIFYEMAIL
    )[0].tokenBody
    if (!userVerificationToken) throw new Error('Token not found')
    const verifyUrl = `http://localhost/v1/verify/email?vt=${userVerificationToken}`
    await sendEmail(
      email,
      'Sports club email verification',
      `The following link is a one time link and is available for 3 minutes, carefully use it to validate your email: ${verifyUrl}.`
    )
  } catch (error) {
    throw new Error('Verification email failed')
  }
}

export const verifyEmail = async (userVerificationToken: string) => {
  try {
    let userId = ''
    let userEmail = ''
    if (!userVerificationToken) throw new Error('Token not found')
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
    const newSessionExpirationDate = addMinutesToDate(
      new Date(),
      24 * 60
    ).toISOString()

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
  gender: number,
  dob: string,
  job: number,
  teamNameRelatingUserJob?: string
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
      job,
      null,
      teamNameRelatingUserJob
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
      addMinutesToDate(new Date(), 3).toISOString(),
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
    const newSessionExpirationDate = addMinutesToDate(
      new Date(),
      60 * 24
    ).toISOString()

    const newSession = await sessionRepository.createSession(
      newUser,
      newSessionExpirationDate,
      newSignedSessionData
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

const signUpWithGoogle = async (code: string) => {
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens(code)
    if (!id_token || !access_token)
      throw new Error('missing user authentication credentials')
    const googleUserInfo = await getGoogleUser(id_token, access_token)
    if (!googleUserInfo) throw new Error('user credentials missing')

    const user = await userRepository.findUserByEmail(googleUserInfo.email)
    if (user) throw new Error('user already exists')
    let newGoogleUser: User
    if (googleUserInfo.verified_email) {
      newGoogleUser = userRepository.create({
        firstName: googleUserInfo.given_name,
        lastName: googleUserInfo.family_name,
        userGoogleId: googleUserInfo.id,
        profilePicture: googleUserInfo.picture,
        emailVerified: UserEmailVerificationState.VERIFIED
      })
    } else {
      newGoogleUser = userRepository.create({
        firstName: googleUserInfo.given_name,
        lastName: googleUserInfo.family_name,
        userGoogleId: googleUserInfo.id,
        profilePicture: googleUserInfo.picture,
        emailVerified: UserEmailVerificationState.UNVERIFIED
      })

      const verificationToken = sign(
        {
          userId: newGoogleUser.userId,
          userRole: newGoogleUser.role,
          userEmail: newGoogleUser.email
        },
        tokenSecret,
        {
          expiresIn: '3m'
        }
      )

      await tokenRepository.createToken(
        newGoogleUser,
        addMinutesToDate(new Date(), 3).toISOString(),
        verificationToken,
        TokenTypes.VERIFYEMAIL,
        1
      )

      await sendVerificationLink(newGoogleUser.email)
    }
    const savedUser = await userRepository.save(newGoogleUser)

    const newGoogleAccessToken = tokenRepository.create({
      expiresIn: addMinutesToDate(new Date(), 24 * 60).toISOString(),
      tokenBody: sign({ ...newGoogleUser }, tokenSecret),
      tokenType: TokenTypes.GOOGLEACCESS,
      user: savedUser
    })
    const savedNewGoogleAccessToken = await tokenRepository.save(
      newGoogleAccessToken
    )

    const newGoogleSession = sessionRepository.create({
      expiresAt: addMinutesToDate(new Date(), 24 * 60).toISOString(),
      data: JSON.stringify({
        LogStatus: UserLogStatus.LOGGEDIN,
        googleUser: googleUserInfo
      }),
      user: savedUser
    })
    const savedNewGoogleSession = await sessionRepository.save(newGoogleSession)

    return {
      accessToken: savedNewGoogleAccessToken,
      session: savedNewGoogleSession
    }
  } catch (error) {
    throw new Error('signup with google failed')
  }
}

export { signUp, login, logOut, getGoogleUser, signUpWithGoogle }
