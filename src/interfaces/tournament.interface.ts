import { ISponsor } from './sponsor.interface'
import { IMatch } from './match.interface'
import { IsDeleted } from '../enums/globalEnums'

export interface ITournament {
  tournamentId: number
  tournamentName: string
  matches: IMatch[]
  sponsors: ISponsor[]
  createdAt: Date
  isDeleted: IsDeleted
  deletedAt: Date
}
