import { IsDeleted } from '../enums/globalEnums'
import { sponsorRepository } from '../repositories/Sponsor.repository'
import { checkIdValidity } from '../utils/checkIdValidity'

export class SponsorDaos {
  //Find all sports.
  async findSponsors(isDeleted: IsDeleted) {
    return await sponsorRepository.findSponsors(isDeleted)
  }

  async findSponsorById(id: number | string) {
    return await sponsorRepository.findSponsorById(id)
  }

  //Finding a sport with name.
  async findSponsorByName(sponsor_name: string) {
    if (null === sponsor_name || undefined === sponsor_name) return 0
    return await sponsorRepository.findSponsorByName(sponsor_name)
  }

  async softDeleteSponsor(id: number | string) {
    sponsorRepository.softDeleteSponsorById(id)
  }
}
