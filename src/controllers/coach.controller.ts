import { coachRepository } from '../repositories/Coach.repository'
import { checkIdValidity } from '../utils/checkIdValidity'

export class CoachController {
  //Find all coaches.
  async sports() {
    return coachRepository.find()
  }
  //Finding a coach by ID.

  async findCoachById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return coachRepository.findOneBy({ coach_id: checkedId })
  }

  //Finding a sport with name.
}
