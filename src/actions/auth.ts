import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { sign, verify } from 'jsonwebtoken'
import {
  UserEmailVerificationState,
  UserGenders,
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
import { convertFaceBookToSQLDate } from '../utils/convertFaceBookToSQLDate'
import { getUserAge } from '../utils/getUserAge'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

type TFaceBookUser = {
  id: string
  first_name?: string
  last_name?: string
  birthday?: string
  gender?: string
  picture?: {
    data: {
      height: number
      is_silhouette: boolean
      url: string
      width: number
    }
  }
}

type TGitHubUser = {
  id: string
  node_id: string
  avatar_url: string
  name?: string
  email?: string
}
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
    let newEmailVerificationToken: string = null
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

const signUpWithFaceBook = async (code: string) => {
  try {
    const client_id = process.env.FB_APPID_SECRET
    const redirect_uri = process.env.FB_REDIRECT_URI
    const client_secret = process.env.FB_APP_SECRET
    if (!client_id || !redirect_uri || !client_secret || !code)
      throw new Error('missing signup credentials')
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`
    )

    const accessToken = tokenResponse.data.access_token as string
    if (!accessToken || typeof accessToken !== 'string')
      throw new Error('invalid access token')
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: accessToken,
        fields: 'id,first_name,last_name,picture'
      }
    })

    const fbUser = userResponse.data as TFaceBookUser
    if (!fbUser) throw new Error('invalid user')
    let first_name: string = 'guest'
    let last_name: string = null
    let birthday: string = null
    let age: number = null
    let gender: number = null
    let picture: string = null
    if (fbUser.first_name) first_name = fbUser.first_name
    if (fbUser.last_name) last_name = fbUser.last_name
    if (fbUser.birthday) {
      birthday = convertFaceBookToSQLDate(fbUser.birthday)
      age = getUserAge(birthday)
    }

    if (fbUser.gender) {
      if (fbUser.gender === 'male') gender = UserGenders.MALE
      if (fbUser.gender === 'female') gender = UserGenders.FEMALE
    }
    if (fbUser.picture) picture = fbUser.picture.data.url

    const newDbUser = userRepository.create({
      userFaceBookId: fbUser.id,
      firstName: first_name,
      lastName: last_name,
      dob: birthday,
      age: age,
      gender: gender,
      profilePicture: picture,
      emailVerified: 1,
      emailVerifiedAt: new Date().toISOString()
    })

    const savedDbUser = await userRepository.save(newDbUser)

    const { password, tokens, ...safeUser } = savedDbUser

    const newAccessToken = createNewAccessTokenForUser(
      savedDbUser,
      safeUser,
      tokenSecret
    )

    return { accessToken: newAccessToken, user: savedDbUser }
  } catch (error) {
    throw new Error('facebook signup failed')
  }
}

const signUpWithGitHub = async (code: string) => {
  try {
    const client_id = process.env.GITHUB_CLIENT_ID_SECRET
    const redirect_uri = process.env.GITHUB_REDIRECT_URI_SECRET
    const client_secret = process.env.GITHUB_CLIENT_SECRET
    if (!client_id || !redirect_uri || !client_secret || !code)
      throw new Error('missing signup credentials')
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id,
        client_secret,
        code,
        redirect_uri
      },
      {
        headers: { Accept: 'application/json' }
      }
    )

    const accessToken = tokenResponse.data.access_token as string
    if (!accessToken || typeof accessToken !== 'string')
      throw new Error('invalid access token')
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const gitHubUser = userResponse.data as TGitHubUser

    if (!gitHubUser) throw new Error('invalid user')
    let first_name: string = 'guest'
    let email: string = null
    let picture: string = null
    if (gitHubUser.name) first_name = gitHubUser.name
    if (gitHubUser.email) email = gitHubUser.email
    if (gitHubUser.avatar_url) picture = gitHubUser.avatar_url

    const newDbUser = userRepository.create({
      userGitHubId: gitHubUser.id,
      firstName: first_name,
      email: email,
      profilePicture: picture,
      emailVerified: 1,
      emailVerifiedAt: new Date().toISOString()
    })

    const savedDbUser = await userRepository.save(newDbUser)

    const { password, tokens, ...safeUser } = savedDbUser

    const newAccessToken = createNewAccessTokenForUser(
      savedDbUser,
      safeUser,
      tokenSecret
    )

    return { accessToken: newAccessToken, user: savedDbUser }
  } catch (error) {
    throw new Error('github signup failed')
  }
}

export {
  signUp,
  login,
  logOut,
  getGoogleUser,
  signUpWithGoogle,
  signUpWithFaceBook,
  signUpWithGitHub
}
