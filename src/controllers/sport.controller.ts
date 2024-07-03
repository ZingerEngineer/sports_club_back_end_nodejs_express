import { sportRepository } from '../repositories/Sport.repository'
import { checkIdValidity } from '../utils/checkIdValidity'

export class SportController {
  //Find all sports.
  async sports() {
    return sportRepository.find()
  }
  //Finding a sport by ID.

  async findSportById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return sportRepository.findOneBy({ sport_id: checkedId, is_deleted: 0 })
  }

  //Finding a sport with name.
  async findSportByName(sport_name: string) {
    if (null === sport_name || undefined === sport_name) return -1
    return sportRepository.findOneBy({ sport_name: sport_name, is_deleted: 0 })
  }
}
