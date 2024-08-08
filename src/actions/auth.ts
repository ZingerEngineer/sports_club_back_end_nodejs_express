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
import { AuthError, DatabaseError } from '../classes/Errors'

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
type emailVerificationTokenVerificationResults = {
  userId: string
  email: string
  iat: number
}

const newUserSignUpFlow = async (
  userDataToBeTokenized: Partial<User>,
  newDbUser: User,
  JWTAccessTokenExpiresIn: string,
  JWTVerificationTokenExpiresIn: string,
  dbAccessTokenExpiresIn: number,
  dbVerificationTokenExpiresIn: number
) => {
  try {
    const newAccessToken = createJWTToken(
      userDataToBeTokenized,
      JWTAccessTokenExpiresIn
    )
    await tokenRepository.saveNewDbToken(
      newAccessToken,
      newDbUser,
      dbAccessTokenExpiresIn
    )

    const newEmailVerificationToken = createJWTToken(
      userDataToBeTokenized,
      JWTVerificationTokenExpiresIn
    )
    await tokenRepository.saveNewDbToken(
      newEmailVerificationToken,
      newDbUser,
      dbVerificationTokenExpiresIn
    )
    const verificationEmail = await createTokenizedEmailLink(
      newDbUser.email,
      newEmailVerificationToken,
      'verify/email'
    )
    await sendTokenizedEmail(
      'Sports club email verification',
      newDbUser.email,
      verificationEmail
    )
    return {
      accessToken: newAccessToken,
      emailVerificationToken: newEmailVerificationToken
    }
  } catch (error) {
    throw new Error('Signup stopped due to an error')
  }
}

const createTokenizedEmailLink = async (
  email: string,
  token: string,
  route: string
) => {
  try {
    const dbUser = await userRepository.findOne({
      where: {
        email: email
      }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const tokenizedEmail = `http://localhost:1800/v1/${route}?t=${token}`
    const finalEmailForm = `Reset password',"The following email is a one time email and available for 5 minutes only: ${tokenizedEmail}`
    return finalEmailForm
  } catch (error) {
    throw new Error('Verification email creation failed')
  }
}

const sendTokenizedEmail = async (
  emailTitle: string,
  email: string,
  emailBody: string
) => {
  try {
    if (!emailBody) throw new Error('Missing email body')
    await sendEmail(email, emailTitle, emailBody)
  } catch (error) {
    throw new Error('Sending email failed')
  }
}

const verifyEmail = async (userVerificationToken: string) => {
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

const createJWTToken = (userData: Partial<User>, JWTExpiresIn: string) => {
  const JWTToken = sign(userData, tokenSecret, {
    expiresIn: JWTExpiresIn
  })

  return JWTToken
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
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const passCompareCheck = await bcrypt.compare(dbUser.password, formPassword)
    if (!passCompareCheck) throw new AuthError('Incorrect password')
    const { password, tokens, ...safeUser } = dbUser
    const { userId, email, role, phone } = dbUser

    const newAccessToken = createJWTToken({ userId, email, role, phone }, '60d')
    await tokenRepository.saveNewDbToken(newAccessToken, dbUser, 24 * 60 * 60)

    return {
      user: safeUser,
      accessToken: newAccessToken
    }
  } catch (error) {
    throw new AuthError('Login failed')
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
  let dbUser: User
  try {
    dbUser = await userRepository.findUserByEmail(email)
    if (dbUser) {
      throw new DatabaseError('User already exists')
    }
    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) {
      throw new DatabaseError('User already exists')
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
    const savedNewUser = await userRepository.save(newUser)
    const { password, tokens, ...safeUser } = savedNewUser
    const { userId, role } = savedNewUser
    const { accessToken, emailVerificationToken } = await newUserSignUpFlow(
      { userId, email, role, phone },
      savedNewUser,
      '60d',
      '1d',
      24 * 60 * 60,
      24 * 60
    )

    return {
      user: safeUser,
      accessToken: accessToken,
      verificationToken: emailVerificationToken
    }
  } catch (error) {
    console.log(error)
    throw new AuthError('Signup failed')
  }
}

const logOut = async (id: number, accessToken: string) => {
  try {
    const user = await userRepository.findUserById(id)
    if (!user) throw new DatabaseError("User doesn't exist")
    await tokenRepository.deleteToken(accessToken)
  } catch (error) {
    throw new AuthError('Logout failed')
  }
}

const signUpWithGoogle = async (code: string) => {
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens(code)
    if (!id_token || !access_token)
      throw new AuthError('Missing google OAuth credentials')
    const googleUserInfo = await getGoogleUser(id_token, access_token)
    if (!googleUserInfo)
      throw new AuthError(
        'Google authorization failed due to invalid credentials'
      )

    const user = await userRepository.findUserByEmail(googleUserInfo.email)
    if (user) throw new DatabaseError('User already exists')

    const newGoogleUser = userRepository.create({
      firstName: googleUserInfo.given_name,
      lastName: googleUserInfo.family_name,
      userGoogleId: googleUserInfo.id,
      profilePicture: googleUserInfo.picture,
      emailVerified: UserEmailVerificationState.UNVERIFIED
    })
    const savedNewUser = await userRepository.save(newGoogleUser)
    const { password, tokens, ...safeUser } = savedNewUser
    const { userId, userGoogleId, email, phone, role } = savedNewUser
    const { accessToken, emailVerificationToken } = await newUserSignUpFlow(
      { userId, userGoogleId, email, role, phone },
      savedNewUser,
      '60d',
      '1d',
      24 * 60 * 60,
      24 * 60
    )
    return {
      user: safeUser,
      accessToken: accessToken,
      verificationToken: emailVerificationToken
    }
  } catch (error) {
    throw new AuthError('Signup with google failed')
  }
}

const signUpWithFaceBook = async (code: string) => {
  try {
    const client_id = process.env.FB_APPID_SECRET
    const redirect_uri = process.env.FB_REDIRECT_URI
    const client_secret = process.env.FB_APP_SECRET
    if (!client_id || !redirect_uri || !client_secret || !code)
      throw new AuthError('Missing facebook OAuth credentials')
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`
    )

    const fbAccessToken = tokenResponse.data.access_token as string
    if (!fbAccessToken || typeof fbAccessToken !== 'string')
      throw new AuthError('Invalid facebook access token')
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: fbAccessToken,
        fields: 'id,first_name,last_name,picture'
      }
    })

    const fbUser = userResponse.data as TFaceBookUser
    if (!fbUser) throw new Error('Facebook server error')
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

    const newFbUser = userRepository.create({
      userFaceBookId: fbUser.id,
      firstName: first_name,
      lastName: last_name,
      dob: birthday,
      age: age,
      gender: gender,
      profilePicture: picture,
      emailVerified: UserEmailVerificationState.UNVERIFIED
    })

    const savedNewUser = await userRepository.save(newFbUser)
    const { password, tokens, ...safeUser } = savedNewUser
    const { userId, userFaceBookId, email, phone, role } = savedNewUser
    const { accessToken, emailVerificationToken } = await newUserSignUpFlow(
      { userId, userFaceBookId, email, role, phone },
      savedNewUser,
      '60d',
      '1d',
      24 * 60 * 60,
      24 * 60
    )

    return {
      user: safeUser,
      accessToken: accessToken,
      verificationToken: emailVerificationToken
    }
  } catch (error) {
    throw new AuthError('Facebook signup failed')
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

    const gitHubAccessToken = tokenResponse.data.access_token as string
    if (!gitHubAccessToken || typeof gitHubAccessToken !== 'string')
      throw new Error('invalid access token')
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${gitHubAccessToken}`
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

    const newGitHubUser = userRepository.create({
      userGitHubId: gitHubUser.id,
      firstName: first_name,
      email: email,
      profilePicture: picture,
      emailVerified: UserEmailVerificationState.UNVERIFIED
    })

    const savedNewUser = await userRepository.save(newGitHubUser)
    const { password, tokens, ...safeUser } = savedNewUser
    const { userId, userGitHubId, phone, role } = savedNewUser
    const { accessToken, emailVerificationToken } = await newUserSignUpFlow(
      { userId, userGitHubId, email: savedNewUser.email, role, phone },
      savedNewUser,
      '60d',
      '1d',
      24 * 60 * 60,
      24 * 60
    )

    return {
      user: safeUser,
      accessToken: accessToken,
      verificationToken: emailVerificationToken
    }
  } catch (error) {
    throw new AuthError('Github signup failed')
  }
}

const forgotPassword = async (formEmail: string) => {
  const dbUser = await userRepository.findOne({
    where: {
      email: formEmail
    }
  })
  if (!dbUser) throw new DatabaseError("User doesn't exist")
  const { userId, role, email } = dbUser
  const forgotPasswordToken = createJWTToken({ userId, role, email }, '5m')
  await tokenRepository.saveNewDbToken(forgotPasswordToken, dbUser, 5)
  const tokenizedResetEmail = await createTokenizedEmailLink(
    email,
    forgotPasswordToken,
    'verify/email'
  )
  sendTokenizedEmail('Reset email password', email, tokenizedResetEmail)
}

type forgotPasswordTokenVerificationResults = {
  userId: string
  role: number
  email: string
  iat: number
}
const changePassword = async (
  formPassword: string,
  forgotPasswordToken: string
) => {
  try {
    const verificationResults = verify(
      forgotPasswordToken,
      tokenSecret
    ) as forgotPasswordTokenVerificationResults
    if (!verificationResults) throw new Error('Invalid forgot password token')
    const { email } = verificationResults
    if (!email) throw new Error('Missing email')
    const dbUser = await userRepository.findOne({
      where: {
        email
      }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const dbForgetPasswordToken = dbUser.tokens.filter(
      (token) => token.token !== forgotPasswordToken
    )
    if (!dbForgetPasswordToken && dbForgetPasswordToken.length !== 0)
      throw new AuthError('Unauthorized user')
    await userRepository.update(
      {
        password: formPassword
      },
      dbUser
    )

    await tokenRepository.delete({
      token: forgotPasswordToken
    })
  } catch (error) {
    throw new Error('Change password failed')
  }
}

export {
  signUp,
  login,
  logOut,
  getGoogleUser,
  signUpWithGoogle,
  signUpWithFaceBook,
  signUpWithGitHub,
  changePassword,
  verifyEmail,
  forgotPassword
}
