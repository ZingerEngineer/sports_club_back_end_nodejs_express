import { AppDataSource } from '../services/data-source'
import { Token } from '../entities/Token'

export const tokenRepository = AppDataSource.getRepository(Token)
