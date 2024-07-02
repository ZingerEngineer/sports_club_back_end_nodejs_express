import { AppDataSource } from '../data-source'
import { Team } from '../entities/Team'

export const teamRepository = AppDataSource.getRepository(Team)
