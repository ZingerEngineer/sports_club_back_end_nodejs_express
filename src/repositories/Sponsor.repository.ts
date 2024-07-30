import { AppDataSource } from '../services/data-source'
import { Sponsor } from '../entities/Sponsor'
import { IsDeleted } from '../enums/globalEnums'

export const sponsorRepository = AppDataSource.getRepository(Sponsor).extend({
  async findSponsors() {
    try {
      return await sponsorRepository.find({
        relations: {
          teams: true,
          tournaments: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findSponsorById(id: number) {
    try {
      return await sponsorRepository.findOne({
        where: { sponsorId: id },
        relations: {
          teams: true,
          tournaments: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async findSponsorByName(name: string) {
    try {
      return await sponsorRepository.find({
        where: { name: name },
        relations: {
          teams: true,
          tournaments: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async softDeleteSponsorById(id: number) {
    try {
      const sponsor = await sponsorRepository.findOne({
        where: { sponsorId: id }
      })
      if (!sponsor) throw new Error("sponsor doesn't exist")
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETUTCDATE()'
        })
        .where('sponsor.sponsorId = :sponsId', { sponsId: id })
        .execute()
    } catch (error) {
      console.log(error)
      throw new Error('session soft deletion failed')
    }
  },
  async softDeleteSponsorByName(name: string) {
    try {
      const sponsor = await sponsorRepository.findOne({
        where: { name: name }
      })
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .update(Sponsor)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETUTCDATE()'
        })
        .where('sponsor.name = :name', { name: name })
        .execute()
    } catch (error) {
      console.log(error)
      throw new Error('session soft deletion failed')
    }
  },

  async hardDeleteSponsorById(id: number) {
    try {
      const sponsor = await sponsorRepository.findOne({
        where: { sponsorId: id }
      })
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.sponsorId = :sponsId', { sponsId: id })
        .execute()
    } catch (error) {
      console.log(error)
      throw new Error('session hard deletion failed')
    }
  },

  async hardDeleteSponsorByName(name: string) {
    try {
      const sponsor = await sponsorRepository.findOne({
        where: { name: name }
      })
      if (!sponsor) return null
      return await sponsorRepository
        .createQueryBuilder('sponsor')
        .delete()
        .from(Sponsor)
        .where('sponsor.name = :name', { name: name })
        .execute()
    } catch (error) {
      console.log(error)
      throw new Error('session hard deletion failed')
    }
  },

  async createNewSponsor(name: string) {
    const newSponsor = sponsorRepository.create({
      name: name
    })
    return await sponsorRepository.save(newSponsor)
  }
})
