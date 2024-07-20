import { AppDataSource } from '../services/data-source'
import { Coach } from '../entities/Coach'
import { checkIdValidity } from '../utils/checkIdValidity'

export const coachRepository = AppDataSource.getRepository(Coach).extend({
  async coaches() {
    return coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .getMany()
  },

  async findCoachById(id: number) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('coach.coachId = :checkedId', { id })
      .getOne()
  },
  async findCoachByFirstName(firstName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('user.firstName = :firstName', { firstName })
      .getMany()
  },
  async findCoachByLastName(lastName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('user.firstName = :lastName', { lastName })
      .getMany()
  },
  async findCoachByName(firstName: string, lastName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany()
  },
  async findCoachByTeamId(teamId: number) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('team.teamId = :teamId', { teamId })
      .getOne()
  },

  async findCoachByTeamName(teamName: string) {
    return await coachRepository
      .createQueryBuilder('coach')
      .innerJoinAndSelect('coach.user', 'user')
      .innerJoinAndSelect('coach.team', 'team')
      .select([
        'coach.coachId',
        'user.userId',
        'user.role',
        'user.firstName',
        'user.lastName',
        'user.dob',
        'user.age',
        'user.job',
        'user.isDeleted',
        'team.teamId',
        'team.teamName'
      ])
      .where('team.teamName = :teamName', { teamName })
      .getOne()
  }
})
