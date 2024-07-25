import { AppDataSource } from '../services/data-source'
import { Token } from '../entities/Token'
import crypto from 'crypto'
import { User } from '../entities/User'
import { TokenTypes } from '../enums/token.enums'

export const tokenRepository = AppDataSource.getRepository(Token).extend({
  async createToken(
    user: User,
    expiresIn: string,
    tokenBody: string,
    tokenType: TokenTypes,
    tokenUseTimes?: number
  ) {
    try {
      const tokenId = crypto.randomBytes(60).toString('hex')
      const tokenObject = {
        tokenId: tokenId,
        user: user,
        tokenBody,
        tokenType
      }
      if (tokenUseTimes) {
        tokenObject['tokenUseTimes'] = tokenUseTimes
      }
      if (expiresIn) {
        tokenObject['expiresIn'] = expiresIn
      }
      const newToken = tokenRepository.create(tokenObject)
      return await tokenRepository.save(newToken)
    } catch (error) {
      console.log(error)
      return null
    }
  }
})
