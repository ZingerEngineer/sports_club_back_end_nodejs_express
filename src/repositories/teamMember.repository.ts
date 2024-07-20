import { AppDataSource } from '../services/data-source'
import { TeamMember } from '../entities/TeamMember'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'

export const teamMemberRepository = AppDataSource.getRepository(
  TeamMember
).extend({
  async teamMembers(isDeleted: number | null) {
    try {
      return await teamMemberRepository
        .createQueryBuilder('teamMember')
        .innerJoin('teamMember.user', 'user')
        .innerJoin('teamMember.team', 'team')
        .select([
          'teamMember.teamMemberId',
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
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findTeamMemberById(id: number) {
    try {
      return await teamMemberRepository
        .createQueryBuilder('teamMember')
        .innerJoin('teamMember.user', 'user')
        .innerJoin('teamMember.team', 'team')
        .select([
          'teamMember.teamMemberId',
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
        .where('teamMember.teamMemberId = :teamMemberId', {
          teamMemberId: id
        })
        .getOne()
    } catch (error) {
      console.log(error)
      return null
    }
  }
})
