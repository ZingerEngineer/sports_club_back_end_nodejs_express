import { ICoach } from '../interfaces/coach.interface'
import { ITeamMember } from './teamMember.interface'
import { UserJobs, UserRoles } from '../enums/user.enums'
import { IsDeleted } from '../enums/globalEnums'

export interface IUser {
  userId: number
  role: UserRoles
  phone: string
  email: string
  firstName: string
  lastName: string
  dob: Date
  age: number
  job: UserJobs
  teamMembers: ITeamMember[]
  coach: ICoach
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
