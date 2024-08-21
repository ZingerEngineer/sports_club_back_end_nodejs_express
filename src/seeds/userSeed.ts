import {
  createJWTToken,
  createNewDbToken,
  createTokenizedEmailLink,
  sendTokenizedEmail
} from '../actions/auth'
import { tokenRepository } from '../repositories/token.repository'
import { userRepository } from '../repositories/user.repository'
import { AppDataSource } from '../services/data-source'
import bcrypt from 'bcrypt'
const users = [
  {
    email: 'john@example.com',
    formPassword: 'password123'
  },
  {
    phone: '01142687912',
    formPassword: 'password456'
  }
]

export const userSeeder = async (userSeed = users) => {
  try {
    await AppDataSource.initialize()
    console.log('User seeder connected to db.')

    await tokenRepository.delete({})
    console.log('Deleted all tokens.')
    await userRepository.delete({})
    console.log('Deleted all users.')

    for (const user of userSeed) {
      const hashedPassword = await bcrypt.hash(user.formPassword, 10)
      const newUser = userRepository.create({
        email: user.email,
        phone: user.phone,
        password: hashedPassword
      })
      await userRepository.save(newUser)
      const newAccessToken = createJWTToken(
        {
          userId: newUser.userId,
          role: newUser.role,
          email: newUser.email,
          phone: newUser.phone
        },
        '60d'
      )
      const newDbAccessToken = createNewDbToken(
        newAccessToken,
        newUser,
        24 * 60 * 60
      )
      const newEmailVerificationToken = createJWTToken(
        {
          userId: newUser.userId,
          role: newUser.role,
          email: newUser.email,
          phone: newUser.phone
        },
        '1d'
      )
    }
    console.log(`User seeding is done.`)
  } catch (error) {
    console.log(`User seeding failed due to error: ${error}`)
  }
}
;(async () => {
  await userSeeder()
  return
})()
