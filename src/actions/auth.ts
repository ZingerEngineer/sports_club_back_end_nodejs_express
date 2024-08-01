import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { sign, verify } from 'jsonwebtoken'
import {
  UserEmailVerificationState,
  UserLogStatus,
  UserRoles
} from '../enums/user.enums'
import { sendEmail } from '../services/mailerConfig'
import { tokenRepository } from '../repositories/token.repository'
import { addMinutesToDate } from '../utils/addMinutesToDate'
import axios from 'axios'
import {
  getGoogleOAuthTokens,
  getGoogleUser
} from '../services/google.oauth.services'
import { Token } from '../entities/Token'
import { JWTPayload } from 'jose'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

const sendVerificationLink = async (
  email: string,
  verificationToken: string
) => {
  try {
    const dbUser = await userRepository.findOne({
      where: {
        email: email
      }
    })
    if (!dbUser) throw new Error("user doesn't exists")
    if (!verificationToken) throw new Error('verification token missing')
    const verifyUrl = `http://localhost/v1/verify/email?vt=${verificationToken}`
    await sendEmail(
      email,
      'Sports club email verification',
      `The following link is a one time link and is available for 3 minutes, carefully use it to validate your email: ${verifyUrl}.`
    )
  } catch (error) {
    throw new Error('verification mail creation failed')
  }
}
type emailVerificationTokenVerificationResults = {
  userId: string
  email: string
  iat: number
}

export const verifyEmail = async (userVerificationToken: string) => {
  try {
    const verificationResults = verify(
      userVerificationToken,
      tokenSecret
    ) as emailVerificationTokenVerificationResults
    const { userId, email } = verificationResults
    await userRepository.makeUserEmailVertified(userId, email)
    const user = await userRepository.findOne({ where: { email: email } })
    await tokenRepository.delete({
      user,
      token: userVerificationToken
    })
  } catch (error) {
    throw new Error('email verification failed')
  }
}

const createEmailVerificationToken = async (
  dbUser: User,
  tokenSecret: string
) => {
  const newEmailVerificationToken = sign(
    {
      userId: dbUser.userId,
      userEmail: dbUser.email
    },
    tokenSecret,
    {
      expiresIn: '5m'
    }
  )

  const newDbEmailVerificationToken = tokenRepository.create({
    expiresAt: addMinutesToDate(new Date(), 5).toISOString(),
    user: dbUser,
    token: newEmailVerificationToken
  })
  await tokenRepository.save(newDbEmailVerificationToken)
  return newEmailVerificationToken
}

const createNewAccessTokenForUser = async (
  dbUser: User,
  returnedUser: Partial<User>,
  tokenSecret: string
) => {
  const newAccessToken = sign(returnedUser, tokenSecret, { expiresIn: '60d' })
  const newDbAccessToken = tokenRepository.create({
    user: dbUser,
    expiresAt: addMinutesToDate(new Date(), 24 * 60 * 60).toISOString(),
    token: newAccessToken
  })
  await tokenRepository.save(newDbAccessToken)
  return newAccessToken
}

const login = async (
  formEmail: string,
  formPhone: string,
  formPassword: string
) => {
  try {
    let dbUser: User
    if (formEmail) {
      dbUser = await userRepository.findUserByEmail(formEmail)
    }
    if (formPhone) {
      dbUser = await userRepository.findUserByPhone(formPhone)
    }
    if (!dbUser) throw new Error("user doesn't exist")
    const passCompareCheck = await bcrypt.compare(dbUser.password, formPassword)
    if (!passCompareCheck) throw new Error('incorrect password')
    const { password, tokens, ...safeUser } = dbUser

    const newAccessToken = await createNewAccessTokenForUser(
      dbUser,
      safeUser,
      tokenSecret
    )

    return {
      user: safeUser,
      accessToken: newAccessToken
    }
  } catch (error) {
    throw new Error('login failed')
  }
}

const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  formPassword: string,
  gender: number,
  dob: string,
  job: number,
  teamNameRelatingUserJob?: string
) => {
  try {
    let dbUser: User
    dbUser = await userRepository.findUserByEmail(email)
    if (dbUser) {
      throw new Error('user already exists')
    }
    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) {
      throw new Error('user already exists')
    }
    const newUser = await userRepository.createUser(
      firstName,
      lastName,
      gender,
      email,
      phone,
      formPassword,
      UserRoles.USER,
      dob,
      job,
      null,
      teamNameRelatingUserJob
    )

    const { password, tokens, ...safeUser } = newUser
    const newAccessToken = await createNewAccessTokenForUser(
      newUser,
      safeUser,
      tokenSecret
    )
    const newEmailVerificationToken = await createEmailVerificationToken(
      newUser,
      tokenSecret
    )

    await sendVerificationLink(newUser.email, newEmailVerificationToken)

    return {
      user: newUser,
      accessToken: newAccessToken,
      verificationToken: newEmailVerificationToken
    }
  } catch (error) {
    throw new Error('Signup failed')
  }
}

const logOut = async (id: number, accessToken: string) => {
  try {
    const user = await userRepository.findUserById(id)
    if (!user) throw new Error("user doesn't exist")
    await tokenRepository.deleteToken(accessToken)
  } catch (error) {
    throw new Error('logout failed')
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
    let newEmailVerificationToken: string
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

      newEmailVerificationToken = await createEmailVerificationToken(
        newGoogleUser,
        tokenSecret
      )
      await sendVerificationLink(newGoogleUser.email, newEmailVerificationToken)
    }
    const savedUser = await userRepository.save(newGoogleUser)

    const { password, tokens, ...safeUser } = newGoogleUser
    const newAccessToken = await createNewAccessTokenForUser(
      savedUser,
      safeUser,
      tokenSecret
    )
    return {
      user: safeUser,
      accessToken: newAccessToken,
      verificationToken: newEmailVerificationToken
    }
  } catch (error) {
    throw new Error('signup with google failed')
  }
}

export { signUp, login, logOut, getGoogleUser, signUpWithGoogle }
