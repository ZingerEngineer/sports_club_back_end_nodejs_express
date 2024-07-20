import { AppDataSource } from '../services/data-source'
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
          'sponsor.sponsorId',
          'sponsor.name',
          'sponsor.isDeleted',
          'team.teamId',
          'team.teamName',
          'tournament.tournamentId',
          'tournament.tournamentName'
        ])

      if (isDeleted !== IsDeleted.NULL) {
        query.where('sponsor.isDeleted = :isDeleted', {
          isDeleted: isDeleted
        })
      }
      const sponsors = await query.getMany()
      if (sponsors.length === 0) return null
      return sponsors
    } catch (error) {
      console.log(error)
    }
  },

  async findSponsorById(id: number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return null
      const sponsId = checkRes.id

      const sponsor = await sponsorRepository
        .createQueryBuilder('sponsor')
        .innerJoin('sponsor.team', 'team')
        .innerJoin('sponsor.tournament', 'tournament')
        .select([
          'sponsor.sponsorId',
          'sponsor.name',
          'sponsor.isDeleted',
          'team.teamId',
          'team.teamName',
          'tournament.tournamentId',
          'tournament.tournamentName'
        ])
        .where('sponsor.sponsorId = :sponsId', { sponsId })
        .getOne()
      if (!sponsor) return null
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
          'sponsor.sponsorId',
          'sponsor.name',
          'sponsor.isDeleted',
          'team.teamId',
          'team.teamName',
          'tournament.tournamentId',
          'tournament.tournamentName'
        ])
        .where('sponsor.name = :brandName', { brandName })
        .getOne()

      if (!sponsor) return null
      return sponsor
    } catch (error) {
      console.log(error)
    }
  },
  async softDeleteSponsorById(id: number) {
    try {
      const sponsor = await sponsorRepository.findSponsorById(id)
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('sponsor.sponsorId = :sponsId', { id })
        .execute()
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async softDeleteSponsorByName(name: string) {
    try {
      const sponsor = await sponsorRepository.findSponsorByName(name)
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('sponsor.name = :brandName', { brandName: name })
        .execute()
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async hardDeleteSponsorById(id: number) {
    try {
      const sponsor = await sponsorRepository.findSponsorById(id)
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.sponsorId = :sponsId', { id })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteSponsorByName(name: string) {
    try {
      const sponsor = await sponsorRepository.findSponsorByName(name)
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.name = :brandName', { brandName: name })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async createNewSponsor(
    name: string,
    teamName?: string,
    tournamentName?: string
  ) {
    const newSponsor = sponsorRepository.create()
    sponsorRepository.createQueryBuilder('sponsor').update(Sponsor).set({
      name: name
    })

    if (teamName || teamName !== '') {
      try {
        const team = await teamRepository.findTeamByName(teamName)
        if (!team) return null
        const teamId = team.teamId

        await sponsorRepository
          .createQueryBuilder('sponsor')
          .relation(Sponsor, 'sponsored_teams')
          .of(newSponsor.sponsorId)
          .add(teamId)
      } catch (error) {
        console.log()
      }
    }
    if (tournamentName || tournamentName !== '') {
      try {
        const tournament = await tournamentRepository.findTournamentByName(
          tournamentName
        )
        if (!tournament) return null
        const tournamentId = tournament.tournamentId
        await sponsorRepository
          .createQueryBuilder('sponsor')
          .relation(Sponsor, 'sponsored_tournaments')
          .of(newSponsor.sponsorId)
          .add(tournamentId)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
