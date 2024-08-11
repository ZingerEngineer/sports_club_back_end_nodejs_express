import { verify } from 'jsonwebtoken'
import { userRepository } from '../repositories/user.repository'
import dotenv from 'dotenv'
import { AuthError, DatabaseError } from '../classes/Errors'
interface AccessTokenVerificationData {
  userId: number
  email: string
  role: string
  phone: string
}

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET
const getUserData = async (accessToken: string) => {
  const { userId } = verify(
    accessToken,
    tokenSecret
  ) as AccessTokenVerificationData
  if (!userId) throw new AuthError('Invalid user claims')
  const dbUser = await userRepository.findUserById(userId)
  if (!dbUser) throw new DatabaseError("User doesn't exist")
  return dbUser
}

const changeProfilePicture = async (accessToken: string) => {
  const { userId } = verify(
    accessToken,
    tokenSecret
  ) as AccessTokenVerificationData
  if (!userId) throw new AuthError('Invalid user claims')
  const dbUser = await userRepository.findUserById(userId)
  if (!dbUser) throw new DatabaseError("User doesn't exist")
  return dbUser
}
