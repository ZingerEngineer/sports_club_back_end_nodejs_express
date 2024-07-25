import { AppDataSource } from '../services/data-source'
import { Session } from '../entities/Session'
import crypto from 'crypto'
import { User } from '../entities/User'

export const sessionRepository = AppDataSource.getRepository(Session).extend({
  async createSession(user: User, expiresAt?: string, sessionData?: string) {
    try {
      const sessionId = crypto.randomBytes(60).toString('hex')
      const sessionObject = {
        sessionId: sessionId,
        user: user
      }

      if (expiresAt) {
        sessionObject['expiresAt'] = expiresAt
      }
      if (sessionData) {
        sessionObject['data'] = sessionData
      }
      const newSession = sessionRepository.create(sessionObject)
      return await sessionRepository.save(newSession)
    } catch (error) {
      console.log({ sessionError: error })
      return null
    }
  }
})
