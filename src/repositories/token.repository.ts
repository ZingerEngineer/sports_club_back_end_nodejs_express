import { AppDataSource } from '../services/data-source'
import { Token } from '../entities/Token'

export const tokenRepository = AppDataSource.getRepository(Token).extend({
  async deleteToken(token: string) {
    tokenRepository
      .createQueryBuilder('token')
      .delete()
      .from(Token)
      .where('token.token = :tokenBody', { tokenBody: token })
  }
})
