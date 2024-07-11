import { AppDataSource } from '../data-source'
import { Sponsor } from '../entities/Sponsor'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { teamRepository } from './team.repository'
import { tournamentRepository } from './tournament.repository'

export const sponsorRepository = AppDataSource.getRepository(Sponsor).extend({
  async findSponsors(isDeleted: number | null) {
    try {
      const query = sponsorRepository
        .createQueryBuilder('sponsor')
        .innerJoin('sponsor.team', 'team')
        .innerJoin('sponsor.tournament', 'tournament')
        .select([
          'sponsor.sponsor_id',
          'sponsor.brand_name',
          'sponsor.is_deleted',
          'team.team_id',
          'team.team_name',
          'tournament.tournament_id',
          'tournament.tournament_name'
        ])

      if (isDeleted !== IsDeleted.NULL) {
        query.where('sponsor.is_deleted = :isDeleted', {
          isDeleted: isDeleted
        })
      }
      const sponsors = await query.getMany()
      if (sponsors.length === 0) return 0
      return sponsors
    } catch (error) {
      console.log(error)
    }
  },

  async findSponsorById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const sponsId = checkRes.id

      const sponsor = await sponsorRepository
        .createQueryBuilder('sponsor')
        .innerJoin('sponsor.team', 'team')
        .innerJoin('sponsor.tournament', 'tournament')
        .select([
          'sponsor.sponsor_id',
          'sponsor.brand_name',
          'sponsor.is_deleted',
          'team.team_id',
          'team.team_name',
          'tournament.tournament_id',
          'tournament.tournament_name'
        ])
        .where('sponsor.sponsor_id = :sponsId', { sponsId })
        .getOne()
      if (!sponsor) return 0
      return sponsor
    } catch (error) {
      console.log(error)
    }
  },
  async findSponsorByName(brandName: string) {
    try {
      const sponsor = await sponsorRepository
        .createQueryBuilder('sponsor')
        .innerJoin('sponsor.team', 'team')
        .innerJoin('sponsor.tournament', 'tournament')
        .select([
          'sponsor.sponsor_id',
          'sponsor.brand_name',
          'sponsor.is_deleted',
          'team.team_id',
          'team.team_name',
          'tournament.tournament_id',
          'tournament.tournament_name'
        ])
        .where('sponsor.brand_name = :brandName', { brandName })
        .getOne()

      if (!sponsor) return 0
      return sponsor
    } catch (error) {
      console.log(error)
    }
  },
  async softDeleteSponsorById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const sponsId = checkRes.id

      const sponsorAvailableCheck = await sponsorRepository.findSponsorById(
        sponsId
      )
      if (sponsorAvailableCheck === 0) return 0
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('sponsor.sponsor_id = :sponsId', { sponsId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },
  async softDeleteSponsorByName(brand_name: string) {
    try {
      const sponsorAvailableCheck = await sponsorRepository.findSponsorByName(
        brand_name
      )
      if (sponsorAvailableCheck === 0) return 0
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('sponsor.brand_name = :brandName', { brandName: brand_name })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteSponsorById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const sponsId = checkRes.id

      const sponsorAvailableCheck = await sponsorRepository.findSponsorById(
        sponsId
      )
      if (sponsorAvailableCheck === 0) return 0
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.sponsor_id = :sponsId', { sponsId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteSponsorByName(brand_name: string) {
    try {
      const sponsorAvailableCheck = await sponsorRepository.findSponsorByName(
        brand_name
      )
      if (sponsorAvailableCheck === 0) return 0
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.brand_name = :brandName', { brandName: brand_name })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async createNewSponsor(
    brand_name: string,
    team_name?: string,
    tournament_name?: string
  ) {
    const newSponsor = sponsorRepository.create()
    sponsorRepository.createQueryBuilder('sponsor').update(Sponsor).set({
      brand_name: brand_name
    })

    if (team_name || team_name !== '') {
      try {
        const team = await teamRepository.findTeamByName(team_name)
        if (team === 0) return 0
        const teamId = team.team_id

        await sponsorRepository
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
        await sponsorRepository
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
