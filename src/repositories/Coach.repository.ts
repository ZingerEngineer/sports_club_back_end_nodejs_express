import { AppDataSource } from '../data-source'
import { Coach } from '../entities/Coach'
import { checkIdValidity } from '../utils/checkIdValidity'

export const coachRepository = AppDataSource.getRepository(Coach).extend({
  findCoachById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return coachRepository
      .createQueryBuilder('coach')
      .select('coach_id')
      .where('coach.coach_id = :coach_id', { checkedId })
      .leftJoin('coach.user', 'user')
      .andWhere('user.is_deleted = 0')
      .getOne()
  },
  findCoachByFirstName(firstName: string) {
    return coachRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.user', 'user')
      .where('user.first_name = :firstName', { firstName })
      .getMany()
  },
  findCoachByLastName(lastName: string) {
    return coachRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.user', 'user')
      .where('user.last_name = :lastName', { lastName })
      .getMany()
  },
  findCoachByName(firstName: string, lastName: string) {
    return coachRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.user', 'user')
      .where('user.first_name = :firstName', { firstName })
      .andWhere('user.last_name = :lastName', { lastName })
      .andWhere('user.is_deleted = 0')
      .getMany()
  },
  findCoachByTeam(teamId: string | number) {
    const checkRes = checkIdValidity(teamId)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return coachRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.team', 'team')
      .where('team.team_id = :teamId', { checkedId })
      .andWhere('team.is_deleted = 0')
      .leftJoinAndSelect('coach.user', 'user')
      .andWhere('user.is_deleted = 0')
      .getOne()
  }
})
