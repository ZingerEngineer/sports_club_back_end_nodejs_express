import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  DeleteDateColumn
} from 'typeorm'
import { Team } from './Team'
import { Sport } from './Sport'
import { Tournament } from './Tournament'
import { IsDeleted } from '../enums/globalEnums'
import { MatchType } from '../enums/match.enums'

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  matchId: number

  @Column({
    type: 'int',
    width: 1,
    default: MatchType.SCRIMMAGE,
    nullable: false
  })
  type: number

  @ManyToOne(() => Sport, (sport) => sport.matches)
  sport: Sport

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  tournament: Tournament

  @ManyToMany(() => Team, (team) => team.wonMatches)
  @JoinTable({
    name: 'won_team_match',
    joinColumn: {
      name: 'matchId',
      referencedColumnName: 'matchId'
    },
    inverseJoinColumn: {
      name: 'won_team_id',
      referencedColumnName: 'teamId'
    }
  })
  wonTeams: Team[]

  @ManyToMany(() => Team, (team) => team.lostMatches)
  @JoinTable({
    name: 'lost_team_match',
    joinColumn: {
      name: 'matchId',
      referencedColumnName: 'matchId'
    },
    inverseJoinColumn: {
      name: 'lost_team_id',
      referencedColumnName: 'teamId'
    }
  })
  lostTeams: Team[]

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'time',
    precision: 3,
    nullable: false,
    default: '00:00:00.000'
  })
  duration: string

  @Column({
    type: 'int',
    width: 1,
    nullable: false,
    default: IsDeleted.EXISTS
  })
  isDeleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: string
}
