import { AppDataSource } from '../data-source'
import { Team_member } from '../entities/Team_member'

export const teamMemberRepository = AppDataSource.getRepository(Team_member)
