import { TeamType } from '../enums/team.enums'
import { ISport } from './sport.interface'
import { ISponsor } from './sponsor.interface'
import { IMatch } from './match.interface'
import { ITeamMember } from './teamMember.interface'
import { ICoach } from './coach.interface'
import { IsDeleted } from '../enums/globalEnums'

export interface ITeam {
  teamId: number
  teamName: string
  teamType: TeamType
  belowAge: number
  matchesWon: number
  matchesLost: number
  sport: ISport
  sponsors: ISponsor[]
  teamMembers: ITeamMember[]
  coach: ICoach
  wonMatches: IMatch[]
  lostMatches: IMatch[]
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
