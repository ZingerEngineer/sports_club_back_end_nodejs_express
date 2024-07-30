import { AppDataSource } from '../services/data-source'
import { Coach } from '../entities/Coach'
import { checkIdValidity } from '../utils/checkIdValidity'

export const coachRepository = AppDataSource.getRepository(Coach).extend({
  async coaches() {
    try {
      return await coachRepository.find({
        relations: {
          user: true,
          team: true
        }
      })
    } catch (error) {
      throw new Error('error happened')
    }
  },

  async findCoachById(id: number) {
    try {
      return await coachRepository.findOne({
        where: { coachId: id },
        relations: {
          user: true,
          team: true
        }
      })
    } catch (error) {
      throw new Error('finding coach failed')
    }
  },
  async findCoachByFirstName(firstName: string) {
    try {
      return await coachRepository
        .createQueryBuilder('coach')
        .innerJoin('coach.user', 'user')
        .innerJoin('coach.team', 'team')
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
    } catch (error) {
      throw new Error('finding coaches failed')
    }
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
