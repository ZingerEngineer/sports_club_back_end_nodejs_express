import { AppDataSource } from '../data-source'
import { Match } from '../entities/Match'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { validateDate } from '../utils/validateDate'
import { validateTime } from '../utils/validateTime'
import { validateTruthyNotEmptyString } from '../utils/validateTruthyNotEmptyString'

export const matchRepository = AppDataSource.getRepository(Match).extend({
  async findMatches(isDeleted?: number) {
    try {
      const query = matchRepository
        .createQueryBuilder('match')
        .innerJoin('match.sport', 'sport')
        .innerJoin('match.tournament', 'tournament')
        .innerJoin('match.won_team', 'wonTeams')
        .innerJoin('match.lost_team', 'lostTeams')
        .select([
          'match.match_id',
          'sport.sport_id',
          'tournament.tournament_id',
          'tournament.tournament_name',
          'match.match_type',
          'match.match_id',
          'match.won_team',
          'match.lost_team',
          'sponsor.sponsor_id',
          'sponsor.brand_name'
        ])

      if (isDeleted in IsDeleted) {
        query.where('match.is_deleted = :isDeleted', {
          isDeleted: isDeleted
        })
      }
      const matches = await query.getMany()
      if (matches.length === 0) return 0
      return matches
    } catch (error) {
      console.log(error)
    }
  },

  async findMatchById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const matchId = checkRes.id

      const match = await matchRepository
        .createQueryBuilder('match')
        .innerJoin('match.sport', 'sport')
        .innerJoin('match.tournament', 'tournament')
        .innerJoin('match.won_team', 'wonTeams')
        .innerJoin('match.lost_team', 'lostTeams')
        .select([
          'match.match_id',
          'sport.sport_id',
          'tournament.tournament_id',
          'tournament.tournament_name',
          'match.match_type',
          'match.match_id',
          'match.won_team',
          'match.lost_team',
          'sponsor.sponsor_id',
          'sponsor.brand_name'
        ])
        .where('tournament.tournament_id = :matchId', { matchId })
        .getOne()
      if (!match) return 0
      return match
    } catch (error) {
      console.log(error)
    }
  },

  async softDeleteMatchById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const matchId = checkRes.id

      const matchAvailableCheck = await matchRepository.findMatchById(matchId)
      if (matchAvailableCheck === 0) return 0
      return await matchRepository
        .createQueryBuilder('tournament')
        .update(Match)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('match.match_id = :matchId', { matchId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteMatchById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const matchId = checkRes.id

      const matchAvailableCheck = await matchRepository.findMatchById(matchId)
      if (matchAvailableCheck === 0) return 0
      return await matchRepository
        .createQueryBuilder('match')
        .delete()
        .from(Match)
        .where('match.match_id = :matchId', { matchId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  }

  // async createNewMatch(
  //   sport_name: string,
  //   match_type: string,
  //   date_held: string,
  //   match_duration: string,
  //   won_team: string,
  //   lost_team: string,
  //   tournament_name?: string
  // ) {
  //   if (!sport_name || !validateTruthyNotEmptyString(sport_name)) return 0
  //   if (!match_type || !validateTruthyNotEmptyString(match_type)) return 0
  //   if (!date_held || !validateDate(date_held)) return 0
  //   if (!match_duration || validateTime(match_duration)) return 0
  //   if (!won_team || !validateTruthyNotEmptyString(won_team)) return 0
  //   if (!lost_team || !validateTruthyNotEmptyString(lost_team)) return 0

  //   if
  //   const newMatch = matchRepository.create()
  //   matchRepository
  //     .createQueryBuilder('tournament')
  //     .update(Match)
  //     .set({
  //       tournament_name: title,
  //       date_held: () => 'GETDATE()'
  //     })

  //   if (matchId || matchId !== '') {
  //     try {
  //       const checkRes = checkIdValidity(matchId)
  //       if (checkRes === 0) return 0
  //       const checkedMatchId = checkRes.id

  //       const match = await matchRepository.findMatchById(matchId)
  //       if (match === 0) return 0
  //       const teamId = team.team_id

  //       await matchRepository
  //         .createQueryBuilder('sponsor')
  //         .relation(Sponsor, 'sponsored_teams')
  //         .of(newSponsor.sponsor_id)
  //         .add(teamId)
  //     } catch (error) {
  //       console.log()
  //     }
  //   }
  //   if (tournament_name || tournament_name !== '') {
  //     try {
  //       const tournament = await matchRepository.findMat(tournament_name)
  //       if (tournament === 0) return 0
  //       const matchId = tournament.tournament_id
  //       await matchRepository
  //         .createQueryBuilder('sponsor')
  //         .relation(Sponsor, 'sponsored_tournaments')
  //         .of(newSponsor.sponsor_id)
  //         .add(matchId)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }
})
