import { AppDataSource } from '../services/data-source'
import { Session } from '../entities/Session'
import crypto from 'crypto'
import { User } from '../entities/User'

export const sessionRepository = AppDataSource.getRepository(Session).extend({
  async createSession(user: User, expiresAt: number, sessionData?: string) {
    const sessionId = crypto.randomBytes(60).toString('hex')
    const sessionObject = {
      sessionId: sessionId,
      user: user,
      expiresAt
    }
    sessionData
      ? (sessionObject['data'] = sessionData)
      : (sessionObject['data'] = '')
    const newSession = sessionRepository.create(sessionObject)
    return await sessionRepository.save(newSession)
  }
})
