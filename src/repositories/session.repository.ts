import { AppDataSource } from '../services/data-source'
import { Session } from '../entities/Session'
import crypto from 'crypto'
import { User } from '../entities/User'
import { addMinutesToDate } from '../utils/addMinutesToDate'

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
      } else {
        sessionObject['expiresAt'] = addMinutesToDate(
          new Date(),
          24 * 60
        ).toISOString()
      }
      if (sessionData) {
        sessionObject['data'] = sessionData
      } else {
        sessionObject['data'] = ''
      }
      const newSession = sessionRepository.create(sessionObject)
      return await sessionRepository.save(newSession)
    } catch (error) {
      console.log({ sessionError: error })
      return null
    }
  }
})
