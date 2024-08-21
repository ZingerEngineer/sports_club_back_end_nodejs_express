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
import { AppDataSource } from '../services/data-source'
import { EntityManager } from 'typeorm'
import { Token } from '../entities/Token'

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
  email?: string
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

export const createNewDbToken = (
  jwtToken: string,
  user: User,
  minutesToAdd: number
) => {
  const newDbToken = new Token()
  newDbToken.token = jwtToken
  newDbToken.user = user
  newDbToken.tokenUseTimes = 1
  newDbToken.expiresAt = addMinutesToDate(
    new Date(),
    minutesToAdd
  ).toISOString()
  newDbToken.createdAt = new Date().toISOString()
  return newDbToken
}
export const createTokenizedEmailLink = async (
  token: string,
  route: string
) => {
  try {
    const tokenizedEmail = `http://localhost:1800/v1/${route}?t=${token}`
    const finalEmailForm = `"The following email is a one time email and available for 5 minutes only: ${tokenizedEmail}`
    return finalEmailForm
  } catch (error) {
    throw new Error('Tokenized email creation failed')
  }
}

export const sendTokenizedEmail = async (
  emailTitle: string,
  email: string,
  emailBody: string
) => {
  try {
    if (!emailBody) throw new Error('Missing email body')
    await sendEmail(email, emailTitle, emailBody)
  } catch (error) {
    console.trace(error)
    throw new Error('Sending email failed')
  }
}

export const signUpTokensAndEmailCreation = async (
  transactionalEntityManager: EntityManager,
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
    const newDbAccessToken = createNewDbToken(
      newAccessToken,
      newDbUser,
      dbAccessTokenExpiresIn
    )

    await transactionalEntityManager.save(Token, newDbAccessToken)

    const newEmailVerificationToken = createJWTToken(
      userDataToBeTokenized,
      JWTVerificationTokenExpiresIn
    )
    const newDbEmailVerificationToken = createNewDbToken(
      newEmailVerificationToken,
      newDbUser,
      dbVerificationTokenExpiresIn
    )
    await transactionalEntityManager.save(Token, newDbEmailVerificationToken)
    const verificationEmail = await createTokenizedEmailLink(
      newEmailVerificationToken,
      'verify/email'
    )

    return {
      accessToken: newAccessToken,
      emailVerificationToken: newEmailVerificationToken,
      verificationEmail
    }
  } catch (error) {
    throw new Error('Creating tokens failed')
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
    throw new Error('Email verification failed')
  }
}

export const createJWTToken = (
  userData: Partial<User>,
  JWTExpiresIn: string
) => {
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
    let dbUser: User | undefined
    let accessToken: string
    if (formEmail) {
      dbUser = await userRepository.findUserByEmail(formEmail)
    }
    if (formPhone) {
      dbUser = await userRepository.findUserByPhone(formPhone)
    }
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const passCompareCheck = await bcrypt.compare(formPassword, dbUser.password)
    if (!passCompareCheck) throw new AuthError('Incorrect password')
    const { password, tokens, ...safeUser } = dbUser
    const { userId, email, role, phone, emailVerified } = dbUser

    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const newAccessToken = createJWTToken(
            { userId, email, role, phone, emailVerified },
            '60d'
          )
          accessToken = newAccessToken
          const newDbAccessToken = createNewDbToken(
            newAccessToken,
            dbUser,
            24 * 60 * 60
          )
          await transactionalEntityManager.save(Token, newDbAccessToken)
        } catch (error) {
          throw new AuthError('Login failed')
        }
      }
    )
    return {
      user: safeUser,
      accessToken
    }
  } catch (error) {
    console.trace()
    throw Error('Login failed')
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
  job: number
) => {
  let dbUser: User | undefined
  let safeUser: Partial<User> | undefined
  let accessToken: string | undefined
  let verificationToken: string | undefined
  try {
    dbUser = await userRepository.findUserByEmail(email)
    if (dbUser) throw new DatabaseError('User already exists')

    dbUser = await userRepository.findUserByPhone(phone)
    if (dbUser) throw new DatabaseError('User already exists')

    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const newUser = transactionalEntityManager.create(User, {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email,
            phone: phone,
            password: formPassword,
            role: UserRoles.USER,
            dob: dob,
            job: job
          })
          const savedNewUser = await transactionalEntityManager.save(
            User,
            newUser
          )
          const { password, tokens, ...filteredUser } = savedNewUser
          safeUser = filteredUser
          const { userId, role, emailVerified } = savedNewUser
          const tokensAndEmailRes = await signUpTokensAndEmailCreation(
            transactionalEntityManager,
            { userId, email, role, phone, emailVerified },
            savedNewUser,
            '60d',
            '1d',
            24 * 60 * 60,
            24 * 60
          )
          accessToken = tokensAndEmailRes.accessToken
          verificationToken = tokensAndEmailRes.emailVerificationToken
          sendTokenizedEmail(
            'Email verification',
            safeUser.email,
            tokensAndEmailRes.verificationEmail
          )
        } catch (error) {
          console.trace()
          throw new Error('Signup transactions failed')
        }
      }
    )
    return {
      user: safeUser,
      accessToken,
      verificationToken
    }
  } catch (error) {
    console.trace()
    throw new AuthError('User signup failed')
  }
}

const logOut = async (id: number, accessToken: string) => {
  try {
    const user = await userRepository.findUserById(id)
    if (!user) throw new DatabaseError("User doesn't exist")
    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          await transactionalEntityManager.delete(Token, {
            token: accessToken
          })
        } catch (error) {
          console.trace()
          throw new Error('Logging out transactions failed')
        }
      }
    )
  } catch (error) {
    console.trace()
    throw new AuthError('Logout failed')
  }
}

const signUpWithGoogle = async (code: string) => {
  let existingGoogleUser: User
  let safeUser: Partial<User> | undefined
  let accessToken: string | undefined
  let verificationToken: string | undefined
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens(code)
    if (!id_token || !access_token)
      throw new AuthError('Missing google OAuth claims')
    const googleUserInfo = await getGoogleUser(id_token, access_token)
    if (!googleUserInfo)
      throw new AuthError('Google authorization failed due to invalid claims')

    existingGoogleUser = await userRepository.findOneBy({
      userGoogleId: googleUserInfo.id
    })
    if (existingGoogleUser) {
      await AppDataSource.transaction(
        async (transactionalEntityManager: EntityManager) => {
          try {
            const { password, tokens, ...filteredUser } = existingGoogleUser
            safeUser = filteredUser
            const { userId, userGoogleId, email, phone, role, emailVerified } =
              existingGoogleUser
            const newAccessToken = createJWTToken(
              { userId, userGoogleId, email, phone, role, emailVerified },
              '60d'
            )
            accessToken = newAccessToken
            const newDbAccessToken = createNewDbToken(
              newAccessToken,
              existingGoogleUser,
              24 * 60 * 60
            )

            await transactionalEntityManager.save(Token, newDbAccessToken)
          } catch (error) {
            console.trace()
            throw new Error('Google login transactions failed')
          }
        }
      )
      return {
        user: safeUser,
        accessToken,
        verificationToken: null
      }
    }

    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const newGoogleUser = transactionalEntityManager.create(User, {
            firstName: googleUserInfo.given_name,
            lastName: googleUserInfo.family_name,
            userGoogleId: googleUserInfo.id,
            profilePicture: googleUserInfo.picture,
            emailVerified: UserEmailVerificationState.UNVERIFIED
          })
          const savedNewUser = await transactionalEntityManager.save(
            User,
            newGoogleUser
          )
          const { password, tokens, ...filteredUser } = savedNewUser
          safeUser = filteredUser
          const { userId, userGoogleId, email, phone, role, emailVerified } =
            savedNewUser
          const tokensAndEmailRes = await signUpTokensAndEmailCreation(
            transactionalEntityManager,
            { userId, userGoogleId, email, phone, role, emailVerified },
            savedNewUser,
            '60d',
            '1d',
            24 * 60 * 60,
            24 * 60
          )
          accessToken = tokensAndEmailRes.accessToken
          verificationToken = tokensAndEmailRes.emailVerificationToken

          sendTokenizedEmail(
            'Email verification',
            safeUser.email,
            tokensAndEmailRes.verificationEmail
          )
        } catch (error) {
          console.trace()
          throw new Error('Google signup transactions failed')
        }
      }
    )

    return {
      user: safeUser,
      accessToken,
      verificationToken
    }
  } catch (error) {
    console.trace()
    throw new AuthError('Signup with google failed')
  }
}

const signUpWithFaceBook = async (code: string) => {
  let existingFacebookUser: User
  let safeUser: Partial<User> | undefined
  let accessToken: string | undefined
  let verificationToken: string | undefined
  const client_id = process.env.FB_APPID_SECRET
  const redirect_uri = process.env.FB_REDIRECT_URI
  const client_secret = process.env.FB_APP_SECRET
  if (!client_id || !redirect_uri || !client_secret || !code)
    throw new AuthError('Missing facebook OAuth claims')
  try {
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`
    )

    const fbAccessToken = tokenResponse.data.access_token as string
    if (!fbAccessToken || typeof fbAccessToken !== 'string')
      throw new AuthError('Invalid facebook claim')
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: fbAccessToken,
        fields: 'id,first_name,last_name,picture'
      }
    })

    const fbUser = userResponse.data as TFaceBookUser
    if (!fbUser) throw new Error('Facebook server error')
    existingFacebookUser = await userRepository.findOne({
      where: {
        userFaceBookId: fbUser.id
      }
    })
    if (existingFacebookUser) {
      await AppDataSource.transaction(
        async (transactionalEntityManager: EntityManager) => {
          try {
            const { password, tokens, ...filteredUser } = existingFacebookUser
            safeUser = filteredUser
            const {
              userId,
              userFaceBookId,
              email,
              phone,
              role,
              emailVerified
            } = existingFacebookUser
            const newAccessToken = createJWTToken(
              { userId, userFaceBookId, email, phone, role, emailVerified },
              '60d'
            )
            accessToken = newAccessToken
            const newDbAccessToken = createNewDbToken(
              newAccessToken,
              existingFacebookUser,
              24 * 60 * 60
            )

            await transactionalEntityManager.save(Token, newDbAccessToken)
          } catch (error) {
            console.trace()
            throw new Error('Facebook login transactions failed')
          }
        }
      )
      return {
        user: safeUser,
        accessToken
      }
    }
    let first_name: string = 'guest'
    let last_name: string | null = null
    let birthday: string | null = null
    let age: number | null = null
    let gender: number | null = null
    let picture: string | null = null
    let emailToUse: string | null = null
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

    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          if (fbUser.email && fbUser.email !== '') emailToUse = fbUser.email
          const newFaceBookUser = transactionalEntityManager.create(User, {
            userFaceBookId: fbUser.id,
            firstName: first_name,
            lastName: last_name,
            email: emailToUse,
            dob: birthday,
            age: age,
            gender: gender,
            profilePicture: picture,
            emailVerified: UserEmailVerificationState.UNVERIFIED
          })

          const savedNewUser = await transactionalEntityManager.save(
            User,
            newFaceBookUser
          )
          const { password, tokens, ...filteredUser } = savedNewUser
          safeUser = filteredUser
          const { userId, userFaceBookId, email, phone, role, emailVerified } =
            savedNewUser
          if (emailToUse) {
            const tokensAndEmailRes = await signUpTokensAndEmailCreation(
              transactionalEntityManager,
              { userId, userFaceBookId, email, role, phone, emailVerified },
              savedNewUser,
              '60d',
              '1d',
              24 * 60 * 60,
              24 * 60
            )
            accessToken = tokensAndEmailRes.accessToken
            verificationToken = tokensAndEmailRes.emailVerificationToken
          }
          const newAccessToken = createJWTToken(
            { userId, userFaceBookId, email, phone, role, emailVerified },
            '60d'
          )
          accessToken = newAccessToken
          const newDbAccessToken = createNewDbToken(
            newAccessToken,
            existingFacebookUser,
            24 * 60 * 60
          )

          await transactionalEntityManager.save(Token, newDbAccessToken)
          verificationToken = null
        } catch (error) {
          console.trace()
          throw new Error('Facebook signup transactions failed')
        }
      }
    )

    return {
      user: safeUser,
      accessToken,
      verificationToken
    }
  } catch (error) {
    console.trace()
    throw new AuthError('Facebook signup failed')
  }
}

const signUpWithGitHub = async (code: string) => {
  let existingGitHubUser: User
  let safeUser: Partial<User> | undefined
  let accessToken: string | undefined
  let verificationToken: string | undefined
  const client_id = process.env.GITHUB_CLIENT_ID_SECRET
  const redirect_uri = process.env.GITHUB_REDIRECT_URI_SECRET
  const client_secret = process.env.GITHUB_CLIENT_SECRET
  if (!client_id || !redirect_uri || !client_secret || !code)
    throw new Error('missing signup credentials')
  try {
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
    existingGitHubUser = await userRepository.findOne({
      where: {
        userGitHubId: String(gitHubUser.id)
      }
    })

    if (existingGitHubUser) {
      await AppDataSource.transaction(
        async (transactionalEntityManager: EntityManager) => {
          try {
            const { password, tokens, ...filteredUser } = existingGitHubUser
            safeUser = filteredUser
            const { userId, userGitHubId, email, phone, role, emailVerified } =
              existingGitHubUser
            const newAccessToken = createJWTToken(
              { userId, userGitHubId, email, phone, role, emailVerified },
              '60d'
            )
            accessToken = newAccessToken
            const newDbAccessToken = createNewDbToken(
              newAccessToken,
              existingGitHubUser,
              24 * 60 * 60
            )

            await transactionalEntityManager.save(Token, newDbAccessToken)
          } catch (error) {
            console.trace()
            throw new Error('Github login transactions failed')
          }
        }
      )
      return {
        user: safeUser,
        accessToken,
        verificationToken: null
      }
    }

    let first_name: string = 'guest'
    let email: string | null = null
    let picture: string | null = null
    if (gitHubUser.name) first_name = gitHubUser.name
    if (gitHubUser.email) email = gitHubUser.email
    if (gitHubUser.avatar_url) picture = gitHubUser.avatar_url

    AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const newGitHubUser = transactionalEntityManager.create(User, {
            userGitHubId: String(gitHubUser.id),
            firstName: first_name,
            email: email,
            profilePicture: picture,
            emailVerified: UserEmailVerificationState.UNVERIFIED
          })

          const savedNewUser = await transactionalEntityManager.save(
            User,
            newGitHubUser
          )
          const { password, tokens, ...filteredUser } = savedNewUser
          safeUser = filteredUser
          const { userId, userGitHubId, phone, role } = savedNewUser
          const tokensAndEmailRes = await signUpTokensAndEmailCreation(
            transactionalEntityManager,
            { userId, userGitHubId, email: savedNewUser.email, role, phone },
            savedNewUser,
            '60d',
            '1d',
            24 * 60 * 60,
            24 * 60
          )
          accessToken = tokensAndEmailRes.accessToken
          verificationToken = tokensAndEmailRes.emailVerificationToken

          sendTokenizedEmail(
            'Email verification',
            safeUser.email,
            tokensAndEmailRes.verificationEmail
          )
        } catch (error) {
          console.trace()
          throw new Error('Github signup transactions failed')
        }
      }
    )

    return {
      user: safeUser,
      accessToken,
      verificationToken
    }
  } catch (error) {
    console.trace()
    throw new AuthError('Github signup failed')
  }
}

const forgotPassword = async (formEmail: string) => {
  try {
    let forgotPasswordToken: string | null = null
    const dbUser = await userRepository.findOne({
      where: {
        email: formEmail
      }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const { userId, role, email } = dbUser

    AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          forgotPasswordToken = createJWTToken({ userId, role, email }, '5m')
          const newDbForgotPasswordToken = transactionalEntityManager.create(
            Token,
            {
              expiresAt: addMinutesToDate(new Date(), 5).toISOString(),
              user: dbUser,
              tokenUseTimes: 1,
              token: forgotPasswordToken
            }
          )
          await transactionalEntityManager.save(Token, newDbForgotPasswordToken)
        } catch (error) {
          console.trace()
          throw new Error('"Forgot password" transactions failed')
        }
      }
    )

    const tokenizedResetEmail = await createTokenizedEmailLink(
      forgotPasswordToken,
      'reset-password'
    )
    sendTokenizedEmail('Reset password', email, tokenizedResetEmail)
  } catch (error) {
    console.trace()
    throw new AuthError('"Forgot password" failed')
  }
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
      },
      relations: {
        tokens: true
      }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    const dbForgetPasswordToken = dbUser.tokens.filter(
      (token) => token.token === forgotPasswordToken
    )
    if (!dbForgetPasswordToken && dbForgetPasswordToken.length !== 0)
      throw new AuthError('Missing "Forget password" claims')
    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          await transactionalEntityManager.update(
            User,
            {
              password: formPassword
            },
            dbUser
          )
          await transactionalEntityManager.delete(Token, {
            token: forgotPasswordToken
          })
        } catch (error) {
          throw new Error('Reset password transactions failed')
        }
      }
    )
  } catch (error) {
    throw new Error('Reset password failed')
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
