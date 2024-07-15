import { IUser } from './user.interface'
import { ITeam } from './team.interface'

export interface ITeamMember {
  teamMemberId: number
  user: IUser
  team: ITeam
  matchRole: string
  goals: number
  saves: number
  assists: number
  salary: number
}
