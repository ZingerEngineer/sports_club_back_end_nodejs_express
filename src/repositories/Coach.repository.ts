import { AppDataSource } from '../data-source'
import { Coach } from '../entities/Coach'

export const coachRepository = AppDataSource.getRepository(Coach)
