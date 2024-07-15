import { IUser } from './user.interface'
import { ITeam } from './team.interface'

export interface ICoach {
  coachId: number
  user: IUser
  team: ITeam
  salary: number
}
