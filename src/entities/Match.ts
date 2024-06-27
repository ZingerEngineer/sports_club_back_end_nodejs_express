import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinColumn
} from 'typeorm'
import { Team } from './Team'
import { Sport } from './Sport'
import { Tournament } from './Tournament'
import { IsDeleted } from '../enums/globalEnums'
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
    length: '50',
    default: MatchType.SCRIMMAGE,
    nullable: false
  })
  match_type: string

  @ManyToOne(() => Sport, (sport) => sport.sport_id, {
    nullable: false
  })
  @JoinColumn({
    name: 'sport_id'
  })
  sport: Sport

  @ManyToOne(() => Tournament, (tournament) => tournament.match)
  @JoinColumn({
    name: 'tournament_id'
  })
  tournament: Tournament

  @ManyToMany(() => Team, (team) => team.team_id, {
    nullable: false
  })
  @JoinColumn({
    name: 'won_team'
  })
  won_team: Team[]

  @ManyToMany(() => Team, (team) => team.team_id, {
    nullable: false
  })
  @JoinColumn({
    name: 'lost_team'
  })
  lost_team: Team[]

  @Column({
    type: 'date'
  })
  date_held: Date

  @Column({
    type: 'time',
    precision: 3,
    nullable: false,
    default: "'00:00:00.000'"
  })
  match_duration: string

  @Column({
    type: 'int',
    width: 1,
    nullable: false,
    default: IsDeleted.EXISTS
  })
  is_deleted: number
}
