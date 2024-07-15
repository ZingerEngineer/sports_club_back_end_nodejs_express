import { IsDeleted } from '../enums/globalEnums'
import { ITeam } from './team.interface'
import { ITournament } from './tournament.interface'
export interface ISponsor {
  sponsorId: number
  name: string
  teams: ITeam[]
  tournaments: ITournament[]
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
