import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToOne
} from 'typeorm'
import { Team } from './Team'
import { Sport } from './Sport'
import { Tournament } from './Tournament'

export enum MatchType {
  SCRIMMAGE = 'scrimmage',
  MATCHMAKING = 'match_making'
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  match_id: number

  @Column({
    type: 'nvarchar',
    length: '50'
  })
  match_type: string

  @ManyToOne(() => Sport, (sport) => sport.sport_id)
  sport: Sport

  @ManyToOne(() => Tournament, (tournament) => tournament.match)
  tournament: Tournament

  @OneToOne(() => Team, (team) => team.team_id)
  won_team: Team | null

  @OneToOne(() => Team, (team) => team.team_id)
  lost_team: Team | null

  @Column({
    type: 'date'
  })
  date_held: Date

  @Column({ type: 'int', width: 4 })
  match_duration: number

  @Column({
    default: true
  })
  pending: boolean

  @Column({
    default: false
  })
  is_deleted: boolean
}
