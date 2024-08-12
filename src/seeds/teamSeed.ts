import { Team } from '../entities/Team'
import { TeamType } from '../enums/team.enums'
import { sportRepository } from '../repositories/sport.repository'
import { teamRepository } from '../repositories/team.repository'
import { AppDataSource } from '../services/data-source'

const teams = [
  {
    teamName: 'Titans',
    teamType: TeamType.CANDIDATES,
    belowAge: 15,
    sportName: 'Football'
  },
  {
    teamName: 'Lackers',
    teamType: TeamType.AMATURES,
    belowAge: 26,
    sportName: 'Basketball'
  }
]

export const teamSeeder = async (teamSeed = teams) => {
  try {
    await AppDataSource.initialize()
    console.log('Team seeder connected to db.')

    await teamRepository.delete({})
    console.log('Deleted all teams.')

    for (const team of teamSeed) {
      const dbSport = await sportRepository.findOneBy({
        name: team.sportName
      })
      teamRepository.create({
        teamName: team.teamName,
        teamType: team.teamType,
        belowAge: team.belowAge,
        sport: dbSport
      })
      await teamRepository.save(team)
    }
    console.log(`Team seeding is done.`)
  } catch (error) {
    console.log(`Team seeding failed due to error:${error}`)
  }
}
;(async () => {
  await teamSeeder()
  return
})()
