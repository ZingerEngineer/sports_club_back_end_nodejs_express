import { AppDataSource } from '../services/data-source'
import { Token } from '../entities/Token'
import { addMinutesToDate } from '../utils/addMinutesToDate'
import { User } from '../entities/User'

export const tokenRepository = AppDataSource.getRepository(Token).extend({
  async deleteToken(token: string) {
    tokenRepository
      .createQueryBuilder('token')
      .delete()
      .from(Token)
      .where('token.token = :tokenBody', { tokenBody: token })
  }
})
