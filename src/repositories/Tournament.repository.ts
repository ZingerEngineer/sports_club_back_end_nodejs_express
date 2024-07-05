import { AppDataSource } from '../data-source'
import { Tournament } from '../entities/Tournament'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'

export const tournamentRepository = AppDataSource.getRepository(
  Tournament
).extend({
  async findTournaments(isDeleted: number | null) {
    try {
      const query = tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournament_id',
          'tournament.tournament_name',
          'tournament.date_held',
          'tournament.is_deleted',
          'match.match_id',
          'sponsor.sponsor_id'
        ])

      if (isDeleted !== IsDeleted.NULL) {
        query.where('tournament.is_deleted = :isDeleted', {
          isDeleted: isDeleted
        })
      }
      const tournaments = await query.getMany()
      if (tournaments.length === 0) return 0
      return tournaments
    } catch (error) {
      console.log(error)
    }
  },

  async findTournamentById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const tournId = checkRes.id

      const tournament = await tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournament_id',
          'tournament.tournament_name',
          'tournament.date_held',
          'tournament.is_deleted',
          'match.match_id',
          'sponsor.sponsor_id'
        ])
        .where('tournament.tournament_id = :tournId', { tournId })
        .getOne()
      if (!tournament) return 0
      return tournament
    } catch (error) {
      console.log(error)
    }
  },
  async findTournamentByName(title: string) {
    try {
      const tournament = await tournamentRepository
        .createQueryBuilder('tournament')
        .innerJoin('tournament.match', 'match')
        .innerJoin('tournament.sponsor', 'sponsor')
        .select([
          'tournament.tournament_id',
          'tournament.tournament_name',
          'tournament.date_held',
          'tournament.is_deleted',
          'match.match_id',
          'sponsor.sponsor_id'
        ])
        .where('tournament.tournament_name = :title', { title })
        .getOne()
      if (!tournament) return 0
      return tournament
    } catch (error) {
      console.log(error)
    }
  },
  async softDeleteTournamentById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const tournId = checkRes.id

      const tournamentAvailableCheck =
        await tournamentRepository.findTournamentById(tournId)
      if (tournamentAvailableCheck === 0) return 0
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .update(Tournament)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('tournament.tournament_id = :tournId', { tournId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },
  async softDeleteTournamentByName(title: string) {
    try {
      const tournamentAvailableCheck =
        await tournamentRepository.findTournamentByName(title)
      if (tournamentAvailableCheck === 0) return 0
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .update(Tournament)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('tournament.tournament_name = :title', { title })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteTournamentById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const tournamentId = checkRes.id

      const tournamentAvailableCheck =
        await tournamentRepository.findTournamentById(tournamentId)
      if (tournamentAvailableCheck === 0) return 0
      return await tournamentRepository
        .createQueryBuilder('tournament')
        .delete()
        .from(Tournament)
        .where('tournament.tournament_id = :tournamentId', { tournamentId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteTournamentByName(title: string) {
    try {
      const tournamentAvailableCheck =
        await tournamentRepository.findTournamentByName(title)
      if (tournamentAvailableCheck === 0) return 0
      return await tournamentRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Tournament)
        .where('tournament.tournament_name = :title', { title: title })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async createNewTournament(
    title: string,
    team_name?: string,
    tournament_name?: string
  ) {
    const newSponsor = tournamentRepository.create()
    tournamentRepository
      .createQueryBuilder('tournament')
      .update(Tournament)
      .set({
        tournament_name: title
      })

    if (team_name || team_name !== '') {
      try {
        const team = await teamRepository.findTeamByName(team_name)
        if (team === 0) return 0
        const teamId = team.team_id

        await tournamentRepository
          .createQueryBuilder('sponsor')
          .relation(Sponsor, 'sponsored_teams')
          .of(newSponsor.sponsor_id)
          .add(teamId)
      } catch (error) {
        console.log()
      }
    }
    if (tournament_name || tournament_name !== '') {
      try {
        const tournament = await tournamentRepository.findTournamentByName(
          tournament_name
        )
        if (tournament === 0) return 0
        const tournamentId = tournament.tournament_id
        await tournamentRepository
          .createQueryBuilder('sponsor')
          .relation(Sponsor, 'sponsored_tournaments')
          .of(newSponsor.sponsor_id)
          .add(tournamentId)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
