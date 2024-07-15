import { IsDeleted } from '../enums/globalEnums'
import { ITeam } from './team.interface'
import { IMatch } from './match.interface'
export interface ISport {
  sportId: number
  name: string
  description: string
  rules: string
  teams: ITeam[]
  matches: IMatch[]
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
