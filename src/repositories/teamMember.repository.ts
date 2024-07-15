import { AppDataSource } from '../data-source'
import { TeamMember } from '../entities/TeamMember'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'

export const teamMemberRepository = AppDataSource.getRepository(
  TeamMember
).extend({
  async teamMembers(isDeleted: number | null) {
    const query = teamMemberRepository
      .createQueryBuilder('teamMember')
      .innerJoin('teamMember.user', 'user')
      .innerJoin('teamMember.team', 'team')
      .select([
        'teamMember.team_mem_id',
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
    if (isDeleted !== IsDeleted.NULL) {
      query.where('user.is_deleted = :isDeleted', { isDeleted: isDeleted })
      query.andWhere('team.is_deleted = :isDeleted', { isDeleted: isDeleted })
    }
    return await query.getMany()
  },

  async findTeamMemberById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    return await teamMemberRepository
      .createQueryBuilder('teamMember')
      .innerJoin('teamMember.user', 'user')
      .innerJoin('teamMember.team', 'team')
      .select([
        'teamMember.team_mem_id',
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
      .where('teamMember.team_mem_id = :teamMemId', { teamMemId: checkedId })
      .getOne()
  }
})
