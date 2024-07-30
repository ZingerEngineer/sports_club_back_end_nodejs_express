import { AppDataSource } from '../services/data-source'
import { Team } from '../entities/Team'
import { IsDeleted } from '../enums/globalEnums'

export const teamRepository = AppDataSource.getRepository(Team).extend({
  async findTeamById(id: number) {
    try {
      const team = await teamRepository.findOne({
        where: {
          teamId: id
        },
        relations: {
          sport: true,
          sponsors: true,
          teamMembers: true,
          coach: true,
          wonMatches: true,
          lostMatches: true
        }
      })
      return team
    } catch (error) {
      throw new Error("Team doesn't exist")
    }
  },
  async findTeamByName(name: string) {
    try {
      const team = await teamRepository.findOne({
        where: {
          teamName: name
        },
        relations: {
          sport: true,
          sponsors: true,
          teamMembers: true,
          coach: true,
          wonMatches: true,
          lostMatches: true
        }
      })
      return team
    } catch (error) {
      throw new Error("team doesn't exist")
    }
  },
  async softDeleteTeamById(id: number) {
    try {
      const team = await teamRepository.findOne({ where: { teamId: id } })
      if (!team) return null
      return await teamRepository
        .createQueryBuilder('team')
        .update(Team)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETUTCDATE()'
        })
        .where('team.teamId = :teamId', { teamId: id })
        .execute()
    } catch (error) {
      throw new Error('team soft deletion failed')
    }
  },
  async softDeleteTeamByName(name: string) {
    try {
      const team = await teamRepository.findOne({ where: { teamName: name } })
      if (!team) throw new Error("team doesn't exist")
      return await teamRepository
        .createQueryBuilder('team')
        .update(Team)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETUTCDATE()'
        })
        .where('team.teamName = :teamName', { teamName: name })
        .execute()
    } catch (error) {
      throw new Error('team soft deletion failed')
    }
  },
  async hardDeleteTeamById(id: number) {
    try {
      const team = await teamRepository.findOne({ where: { teamId: id } })
      if (!team) throw new Error("team doesn't exist")
      return await teamRepository
        .createQueryBuilder('team')
        .delete()
        .from(Team)
        .where('team.teamId = :teamId', { teamId: id })
        .execute()
    } catch (error) {
      throw new Error('team hard deletion failed')
    }
  },
  async hardDeleteTeamByName(name: string) {
    try {
      const team = await teamRepository.findOne({ where: { teamName: name } })
      if (!team) return null
      return await teamRepository
        .createQueryBuilder('team')
        .delete()
        .from(Team)
        .where('team.teamName = :teamName', { teamName: name })
        .execute()
    } catch (error) {
      throw new Error('team soft deletion failed')
    }
  }
})
