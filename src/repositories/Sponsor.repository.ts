import { AppDataSource } from '../data-source'
import { Sponsor } from '../entities/Sponsor'

export const sponsorRepository = AppDataSource.getRepository(Sponsor)
