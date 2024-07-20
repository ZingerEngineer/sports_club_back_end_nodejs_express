import { AppDataSource } from '../services/data-source'
import { Team } from '../entities/Team'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'

export const teamRepository = AppDataSource.getRepository(Team).extend({
  async findTeamById(id: number) {
    try {
      const team = await teamRepository
        .createQueryBuilder('team')
        .innerJoin('team.coach', 'coach')
        .innerJoin('team.sport', 'sport')
        .innerJoin('team.sponsor', 'sponsor')

        .select([
          'team.teamId',
          'team.teamName',
          'team.teamType',
          'team.belowAge',
          'team.matchesWon',
          'team.matchesLost',
          'coach.coachId',
          'sport.sportId',
          'sponsor.sponsorId',
          'team.isDeleted'
        ])
        .where('team.teamId = :teamId', { teamId: id })
        .getOne()
      return team
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async findTeamByName(teamName: string) {
    try {
      const team = await teamRepository
        .createQueryBuilder('team')
        .innerJoin('team.coach', 'team')
        .innerJoin('team.sport', 'team')
        .innerJoin('team.sponsor', 'team')

        .select([
          'team.teamId',
          'team.teamName',
          'team.team_type',
          'team.below_age',
          'team.matches_won',
          'team.matches_lost',
          'coach.coach_id',
          'sport.sport_id',
          'sponsor.sponsor_id',
          'team.is_deleted'
        ])
        .where('team.teamName = :teamName', { teamName: teamName })
        .getOne()
      return team
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async softDeleteTeamById(id: number) {
    const team = await teamRepository.findTeamById(id)
    if (!team) return null
    return await teamRepository
      .createQueryBuilder('team')
      .update(Team)
      .set({
        isDeleted: IsDeleted.DELETED,
        deletedAt: () => 'GETDATE()'
      })
      .where('team.teamId = :teamId', { teamId: id })
      .execute()
  },
  async softDeleteTeamByName(teamName: string) {
    const team = await teamRepository.findTeamByName(teamName)
    if (!team) return null
    return await teamRepository
      .createQueryBuilder('team')
      .update(Team)
      .set({
        isDeleted: IsDeleted.DELETED,
        deletedAt: () => 'GETDATE()'
      })
      .where('team.teamName = :teamName', { teamName: teamName })
      .execute()
  }
})
