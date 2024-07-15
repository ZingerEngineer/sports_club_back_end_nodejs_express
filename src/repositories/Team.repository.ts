import { AppDataSource } from '../data-source'
import { Team } from '../entities/Team'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'

export const teamRepository = AppDataSource.getRepository(Team).extend({
  async findTeamById(id: string | number) {
    const checkRes = checkIdValidity(id)
    if (!checkRes) return null
    const teamId = checkRes.id

    const team = await teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.coach', 'team')
      .innerJoin('team.sport', 'team')
      .innerJoin('team.sponsor', 'team')

      .select([
        'team.team_id',
        'team.team_name',
        'team.team_type',
        'team.below_age',
        'team.matches_won',
        'team.matches_lost',
        'coach.coach_id',
        'sport.sport_id',
        'sponsor.sponsor_id',
        'team.is_deleted'
      ])
      .where('team.team_id = :teamId', { teamId })
      .getOne()
    if (!team) return null
    return team
  },
  async findTeamByName(team_name: string) {
    const team = await teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.coach', 'team')
      .innerJoin('team.sport', 'team')
      .innerJoin('team.sponsor', 'team')

      .select([
        'team.team_id',
        'team.team_name',
        'team.team_type',
        'team.below_age',
        'team.matches_won',
        'team.matches_lost',
        'coach.coach_id',
        'sport.sport_id',
        'sponsor.sponsor_id',
        'team.is_deleted'
      ])
      .where('team.team_name = :teamName', { teamName: team_name })
      .getOne()
    if (!team) return null
    return team
  },
  async softDeleteTeamById(id: string | number) {
    const checkRes = checkIdValidity(id)
    if (!checkRes) return null
    const teamId = checkRes.id

    const teamAvailableCheck = await teamRepository.findTeamById(teamId)
    if (!teamAvailableCheck) return null
    return await teamRepository
      .createQueryBuilder('team')
      .update(Team)
      .set({
        is_deleted: IsDeleted.DELETED,
        delete_date: () => 'GETDATE()'
      })
      .where('team.team_id = :teamId', { teamId })
      .execute()
  },
  async softDeleteTeamByName(team_name: string) {
    const teamAvailableCheck = await teamRepository.findTeamByName(team_name)
    if (!teamAvailableCheck) return null
    return await teamRepository
      .createQueryBuilder('team')
      .update(Team)
      .set({
        isDeleted: IsDeleted.DELETED,
        deletedAt: () => 'GETDATE()'
      })
      .where('team.team_name = :teamName', { teamName: team_name })
      .execute()
  }
})
