import { sponsorRepository } from '../repositories/Sponsor.repository'
import { checkIdValidity } from '../utils/checkIdValidity'

export class SponsorController {
  //Find all sports.
  async sports() {
    return sponsorRepository.find()
  }
  //Finding a sport by ID.

  async findSponsorById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return sponsorRepository.findOneBy({ sponsor_id: checkedId, is_deleted: 0 })
  }

  //Finding a sport with name.
  async findSponsorByName(sponsor_name: string) {
    if (null === sponsor_name || undefined === sponsor_name) return -1
    return sponsorRepository.findOneBy({
      brand_name: sponsor_name,
      is_deleted: 0
    })
  }
}
