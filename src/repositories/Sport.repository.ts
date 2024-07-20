import { AppDataSource } from '../services/data-source'
import { Sport } from '../entities/Sport'

export const sportRepository = AppDataSource.getRepository(Sport).extend({
  async createNewSport(
    name: string,
    description: string,
    rules: string,
    createdAt: string
  ) {
    const newSport = sportRepository.create({
      name,
      description,
      rules,
      createdAt
    })
    return await sportRepository.save(newSport)
  }
})
