import { AppDataSource } from '../services/data-source'
import { Tournament } from '../entities/Tournament'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { matchRepository } from './match.repository'
import { teamRepository } from './team.repository'
export const tournamentRepository = AppDataSource.getRepository(
  Tournament
).extend({
  async findTournaments() {
    try {
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournamentId',
          'tournament.tournamentName',
          'tournament.createdAt',
          'tournament.isDeleted',
          'match.matchId',
          'sponsor.sponsorId'
        ])
        .getMany()
    } catch (error) {
      console.trace(error)
    }
  },

  async findTournamentById(id: number) {
    try {
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournamentId',
          'tournament.tournamentName',
          'tournament.createdAt',
          'tournament.isDeleted',
          'match.matchId',
          'sponsor.sponsorId'
        ])
        .where('tournament.tournamentId = :tournId', { tournId: id })
        .getOne()
    } catch (error) {
      console.trace(error)
    }
  },
  async findTournamentByName(name: string) {
    try {
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournamentId',
          'tournament.tournamentName',
          'tournament.createdAt',
          'tournament.isDeleted',
          'match.matchId',
          'sponsor.sponsorId'
        ])
        .where('tournament.tournamentName = :name', { name })
        .getOne()
    } catch (error) {
      console.trace(error)
    }
  },
  async softDeleteTournamentById(id: number) {
    try {
      const tournament = await tournamentRepository.findTournamentById(id)
      if (!tournament) throw new Error("Tournament doesn't exist")
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .update(Tournament)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('tournament.tournamentId = :tournId', { tournId: id })
        .execute()
    } catch (error) {
      console.trace(error)
    }
  },
  async softDeleteTournamentByName(name: string) {
    try {
      const tournament = await tournamentRepository.findTournamentByName(name)
      if (!tournament) throw new Error("Tournament doesn't exist")
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .update(Tournament)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('tournament.tournamentName = :name', { name })
        .execute()
    } catch (error) {
      console.trace(error)
    }
  },

  async hardDeleteTournamentById(id: number) {
    try {
      const tournament = await tournamentRepository.findTournamentById(id)
      if (!tournament) throw new Error("Tournament doesn't exist")
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .delete()
        .from(Tournament)
        .where('tournament.tournamentId = :tournamentId', {
          tournamentId: id
        })
        .execute()
    } catch (error) {
      console.trace(error)
    }
  },

  async hardDeleteTournamentByName(name: string) {
    try {
      const tournament = await tournamentRepository.findTournamentByName(name)
      if (!tournament) throw new Error("Tournament doesn't exist")
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .delete()
        .from(Tournament)
        .where('tournament.tournamentName = :name', { name: name })
        .execute()
    } catch (error) {
      console.trace(error)
    }
  },

  async createNewTournament(name: string) {
    const newTournament = tournamentRepository.create({
      tournamentName: name
    })
  }
})
