import { AppDataSource } from '../services/data-source'
import { Match } from '../entities/Match'
import { IsDeleted } from '../enums/globalEnums'
import { MatchType } from '../enums/match.enums'
import { Sport } from '../entities/Sport'
import { Tournament } from '../entities/Tournament'

export const matchRepository = AppDataSource.getRepository(Match).extend({
  async findMatches() {
    try {
      return await matchRepository.find({
        relations: {
          sport: true,
          tournament: true,
          wonTeams: true,
          lostTeams: true
        }
      })
    } catch (error) {
      throw new Error('error happened')
    }
  },

  async findMatchById(id: number) {
    try {
      return await matchRepository
        .createQueryBuilder('match')
        .innerJoin('match.sport', 'sport')
        .innerJoin('match.tournament', 'tournament')
        .innerJoin('match.wonTeams', 'team')
        .innerJoin('match.lostTeams', 'team')
        .select([
          'match.matchId',
          'sport.sportId',
          'tournament.tournamentId',
          'tournament.tournamentName',
          'match.type',
          'match.matchId',
          'match.wonTeams',
          'match.lostTeams',
          'sponsor.sponsorId',
          'sponsor.brandName'
        ])
        .where('tournament.tournamentId = :matchId', { matchId: id })
        .getOne()
    } catch (error) {
      console.log(error)
    }
  },

  async softDeleteMatchById(id: number) {
    try {
      const matchAvailableCheck = await matchRepository.findMatchById(id)
      if (!matchAvailableCheck) return null
      return await matchRepository
        .createQueryBuilder('match')
        .update(Match)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('match.matchId = :matchId', { matchId: id })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteMatchById(id: number) {
    try {
      const matchAvailableCheck = await matchRepository.findMatchById(id)
      if (!matchAvailableCheck) return null
      return await matchRepository
        .createQueryBuilder('match')
        .delete()
        .from(Match)
        .where('match.matchId = :matchId', { matchId: id })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async createNewMatch(
    sport: Sport,
    duration: string,
    tournament?: Tournament,
    type?: number,
    createdAt?: string
  ) {
    if (!type) type = MatchType.SCRIMMAGE
    const newMatch = matchRepository.create({
      type: type,
      sport: sport,
      tournament: tournament,
      duration: duration,
      createdAt: createdAt
    })
    return await matchRepository.save(newMatch)
  }
})
