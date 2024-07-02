import { AppDataSource } from '../data-source'
import { Match } from '../entities/Match'

export const matchRepository = AppDataSource.getRepository(Match)
