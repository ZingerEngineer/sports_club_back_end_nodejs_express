import { AppDataSource } from '../data-source'
import { Session } from '../entities/Session'

export const sessionRepository = AppDataSource.getRepository(Session)
