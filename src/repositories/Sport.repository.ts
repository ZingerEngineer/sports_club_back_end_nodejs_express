import { AppDataSource } from '../data-source'
import { Sport } from '../entities/Sport'

export const sportRepository = AppDataSource.getRepository(Sport)
