import { IsDeleted } from '../enums/globalEnums'
import { teamMemberRepository } from '../repositories/Team_member.repository'
import { checkIdValidity } from '../utils/checkIdValidity'

export class SponsorDaos {
  async findAllTeamMembers(isDeleted: IsDeleted) {
    return await teamMemberRepository.teamMembers(isDeleted)
  }

  async findTeamMemberById(id: string | number) {
    return await teamMemberRepository.findTeamMemberById(id)
  }
}
