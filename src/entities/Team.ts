import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
  OneToMany,
  DeleteDateColumn
} from 'typeorm'
import { Sport } from './Sport'
import { Sponsor } from './Sponsor'
import { TeamMember } from './TeamMember'
import { Coach } from './Coach'
import { IsDeleted } from '../enums/globalEnums'
import { Match } from './Match'
import { TeamType } from '../enums/team.enums'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  teamId: number

  @Column({
    type: 'nvarchar',
    length: 35,
    default: 'Guest team',
    nullable: false
  })
  teamName: string

  @Column({
    type: 'int',
    width: 1,
    nullable: false,
    default: TeamType.CANDIDATES
  })
  teamType: number

  @Column({
    type: 'int',
    width: 2,
    default: 15,
    nullable: false
  })
  belowAge: number

  @Column({
    type: 'int',
    width: 5,
    nullable: false,
    default: 0
  })
  matchesWon: number

  @Column({
    type: 'int',
    width: 5,
    nullable: false,
    default: 0
  })
  matchesLost: number

  @ManyToOne(() => Sport, (sport) => sport.teams)
  sport: Sport

  @ManyToMany(() => Sponsor, (sponsors) => sponsors.teams)
  sponsors: Sponsor[]

  @OneToMany(() => TeamMember, (teamMembers) => teamMembers.team)
  teamMembers: TeamMember[]

  @OneToOne(() => Coach, (coach) => coach.team)
  coach: Coach

  @ManyToMany(() => Match, (matches) => matches.wonTeams)
  wonMatches: Match[]

  @ManyToMany(() => Match, (matches) => matches.lostTeams)
  lostMatches: Match[]

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  isDeleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: string
}
