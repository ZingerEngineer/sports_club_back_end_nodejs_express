import { IsDeleted } from '../enums/globalEnums'
import { MatchType } from '../enums/match.enums'
import { ISport } from './sport.interface'
import { ITeam } from './team.interface'
import { ITournament } from './tournament.interface'
export interface IMatch {
  matchId: number
  type: MatchType
  sport: ISport
  tournament: ITournament
  wonTeams: ITeam[]
  lostTeams: ITeam[]
  duration: string
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
