import { verify } from 'jsonwebtoken'
import { userRepository } from '../repositories/user.repository'
import dotenv from 'dotenv'
import { AuthError, DatabaseError } from '../classes/Errors'
import { AppDataSource } from '../services/data-source'
import { EntityManager, UpdateResult } from 'typeorm'
import { User } from '../entities/User'
import { UserEmailVerificationState } from '../enums/user.enums'
import {
  createJWTToken,
  createNewDbToken,
  createTokenizedEmailLink,
  sendTokenizedEmail,
  signUpTokensAndEmailCreation
} from './auth'

dotenv.config()

const getUserPorfile = async (id: string) => {
  try {
    let userId = Number(id)
    const dbUser = await userRepository.findOne({
      where: { userId: userId }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    return dbUser
  } catch (error) {
    console.trace(error)
    throw new Error('Failed to get user profile')
  }
}

const patchUserNewChange = async (
  changedProperty: string,
  newValue: unknown,
  userId: string
) => {
  let updateResults: null | UpdateResult = null
  try {
    console.log(changedProperty, newValue, userId)
    if (
      changedProperty === 'userId' ||
      changedProperty === 'userGoogleId' ||
      changedProperty === 'userGitHubId' ||
      changedProperty === 'userFaceBookId' ||
      changedProperty === 'password' ||
      changedProperty === 'email'
    )
      throw new AuthError('Invalid property to update')
    const dbUser = await userRepository.findOne({
      where: { userId: Number(userId) }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    updateResults = await userRepository.update(
      {
        userId: Number(userId)
      },
      { [changedProperty]: newValue }
    )

    return updateResults
  } catch (error) {
    console.log(error)
    throw new Error('Failed to update user')
  }
}

const patchUserNewEmail = async (newEmail: string, userId: string) => {
  let updateResults: null | UpdateResult = null
  let verificationToken: null | string = null
  let accessToken: null | string = null
  let verificationEmail: null | string = null
  try {
    const dbUser = await userRepository.findOne({
      where: { userId: Number(userId) }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        updateResults = await transactionalEntityManager.update(
          User,
          {
            email: newEmail,
            emailVerified: UserEmailVerificationState.UNVERIFIED,
            emailVerifiedAt: null
          },
          dbUser
        )
        const response = await signUpTokensAndEmailCreation(
          transactionalEntityManager,
          {
            userId: dbUser.userId,
            email: newEmail,
            role: dbUser.role,
            phone: dbUser.phone
          },
          dbUser,
          '60d',
          '1d',
          24 * 60 * 60,
          24 * 60
        )

        verificationToken = response.emailVerificationToken
        accessToken = response.accessToken
        verificationEmail = response.verificationEmail

        sendTokenizedEmail(
          'New email verification',
          newEmail,
          verificationEmail
        )
      }
    )
    return updateResults
  } catch (error) {
    throw new Error('Failed to update user email')
  }
}
const patchUserNewPassword = async (newPassword: string, userId: string) => {
  let updateResults: null | UpdateResult = null
  try {
    const dbUser = await userRepository.findOne({
      where: { userId: Number(userId) }
    })
    if (!dbUser) throw new DatabaseError("User doesn't exist")
    await AppDataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        updateResults = await transactionalEntityManager.update(
          User,
          {
            password: newPassword
          },
          dbUser
        )
      }
    )
    return updateResults
  } catch (error) {
    throw new Error('Failed to update user email')
  }
}
export {
  getUserPorfile,
  patchUserNewChange,
  patchUserNewEmail,
  patchUserNewPassword
}
