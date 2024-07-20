import { AppDataSource } from '../services/data-source'
import { Sponsor } from '../entities/Sponsor'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { teamRepository } from './team.repository'
import { tournamentRepository } from './tournament.repository'
import { Team } from '../entities/Team'
import { Tournament } from '../entities/Tournament'

export const sponsorRepository = AppDataSource.getRepository(Sponsor).extend({
  async findSponsors() {
    try {
      return await sponsorRepository
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
        .getMany()
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findSponsorById(id: number) {
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
        .where('sponsor.sponsorId = :sponsId', { sponsId: id })
        .getOne()
      return sponsor
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async findSponsorByName(name: string) {
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
        .where('sponsor.name = :name', { name })
        .getOne()
      return sponsor
    } catch (error) {
      console.log(error)
      return null
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
        .where('sponsor.sponsorId = :sponsId', { sponsId: id })
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
        .where('sponsor.name = :name', { name: name })
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
        .where('sponsor.sponsorId = :sponsId', { sponsId: id })
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
        .where('sponsor.name = :name', { name: name })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async createNewSponsor(name: string) {
    const newSponsor = sponsorRepository.create({
      name: name
    })
    return await sponsorRepository.save(newSponsor)
  }
})
