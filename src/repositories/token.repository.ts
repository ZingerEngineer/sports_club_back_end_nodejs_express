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
    if (!tokenUseTimes) tokenUseTimes = 1
    const tokenId = crypto.randomBytes(60).toString('hex')
    const tokenObject = {
      tokenId: tokenId,
      user: user,
      expiresIn,
      tokenBody,
      tokenType,
      tokenUseTimes
    }
    const newToken = tokenRepository.create(tokenObject)
    return await tokenRepository.save(newToken)
  }
})
