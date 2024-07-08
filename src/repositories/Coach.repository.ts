import { AppDataSource } from '../data-source'
import { Coach } from '../entities/Coach'
import { checkIdValidity } from '../utils/checkIdValidity'

export const coachRepository = AppDataSource.getRepository(Coach).extend({
  async coaches() {
    return coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getMany()
  },

  async findCoachById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('coach.coach_id = :checkedId', { checkedId })
      .andWhere('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getOne()
  },
  async findCoachByFirstName(firstName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('user.first_name = :firstName', { firstName })
      .where('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getMany()
  },
  async findCoachByLastName(lastName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('user.first_name = :lastName', { lastName })
      .where('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getMany()
  },
  async findCoachByName(firstName: string, lastName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('user.first_name = :firstName', { firstName })
      .andWhere('user.last_name = :lastName', { lastName })
      .andWhere('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getMany()
  },
  async findCoachByTeamId(teamId: string | number) {
    const checkRes = checkIdValidity(teamId)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('team.team_id = :teamId', { checkedId })
      .andWhere('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getOne()
  },

  async findCoachByTeamName(teamName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coach_id',
        'user.user_id',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.dob',
        'user.age',
        'user.job',
        'user.is_deleted',
        'team.team_id',
        'team.team_name'
      ])
      .where('team.team_name = :teamName', { teamName })
      .andWhere('team.is_deleted = :isTeamDeleted', { isTeamDeleted: 0 })
      .andWhere('user.is_deleted = :isUserDeleted', { isUserDeleted: 0 })
      .getOne()
  },
  async createNewCoach() {}
})
