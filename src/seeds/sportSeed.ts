import { Sport } from '../entities/Sport'
import { sportRepository } from '../repositories/sport.repository'
import { AppDataSource } from '../services/data-source'

const sports: Partial<Sport>[] = [
  {
    name: 'Football',
    description: 'Players play a game where they kick a black & white ball.',
    rules: 'Only touch the ball with your feet.'
  },
  {
    name: 'Basketball',
    description: 'Players play a game where they bounce an orange ball.',
    rules: 'You have to keep dribbling the ball.'
  }
]

export const sportSeeder = async (sportSeed: Partial<Sport>[] = sports) => {
  try {
    await AppDataSource.initialize()

    await sportRepository.delete({})
    console.log('Deleted all sports.')

    console.log('Sport seeder connected to db.')
    for (const sport of sportSeed) {
      sportRepository.create({
        name: sport.name,
        description: sport.description,
        rules: sport.rules
      })
      await sportRepository.save(sport)
    }
    console.log(`Sport seeding is done.`)
  } catch (error) {
    console.log(`Sport seeding failed due to error: ${error}`)
  }
}
;(async () => {
  await sportSeeder()
  return
})()
