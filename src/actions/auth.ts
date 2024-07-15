import { User } from '../entities/User'
import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UserGenders, UserJobs, UserRoles } from '../enums/user.enums'
import { sessionRepository } from '../repositories/session.repository'
import crypto from 'crypto'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

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

  const signedUserData = jsonwebtoken.sign({ dbUser }, tokenSecret)

  return {
    signedUserData
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
  job: UserJobs,
  sessionExpirationTimeStamp: number,
  data?: string
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
    const newSessionId = crypto.randomBytes(60).toString('hex')
    const newSessionDataObject = {
      sessionId: newSessionId,
      user: newUser,
      expiresAt: sessionExpirationTimeStamp
    }
    if (data) newSessionDataObject['data'] = data
    const newSessionEntry = sessionRepository.create(newSessionDataObject)
    await sessionRepository.save(newSessionEntry)
    return {
      user: newUser,
      sessionId: newSessionId
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export { signUp, login }
