import { AppDataSource } from '../services/data-source'
import { Sport } from '../entities/Sport'

export const sportRepository = AppDataSource.getRepository(Sport)
