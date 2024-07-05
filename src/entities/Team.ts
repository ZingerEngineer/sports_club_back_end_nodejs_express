import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn
} from 'typeorm'
import { Sport } from './Sport'
import { Sponsor } from './Sponsor'
import { Team_member } from './Team_member'
import { Coach } from './Coach'
import { IsDeleted } from '../enums/globalEnums'

export enum TeamType {
  CANDIDATES = 'candidates',
  AMATURES = 'amatures',
  INTERNATIONAL = 'international'
}
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number

  @Column({
    type: 'nvarchar',
    length: 35,
    default: 'Guest team',
    nullable: false
  })
  team_name: string

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    default: TeamType.CANDIDATES
  })
  team_type: string

  @Column({
    type: 'int',
    width: 2,
    default: 15,
    nullable: false
  })
  below_age: number

  @Column({
    type: 'int',
    width: 5,
    nullable: false,
    default: 0
  })
  matches_won: number

  @Column({
    type: 'int',
    width: 5,
    nullable: false,
    default: 0
  })
  matches_lost: number

  @ManyToOne(() => Sport, (sport) => sport.team, {
    nullable: true
  })
  @JoinColumn({
    name: 'sport_id'
  })
  sport: Sport

  @ManyToMany(() => Sponsor, (sponsor) => sponsor.team, {
    nullable: true
  })
  @JoinColumn({
    name: 'sponsor_id'
  })
  sponsor: Sponsor[]

  @OneToMany(() => Team_member, (team_member) => team_member.team)
  team_member: Team_member[]

  @OneToOne(() => Coach, (coach) => coach.team, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
    nullable: true
  })
  @JoinColumn({
    name: 'coach_id'
  })
  coach: Coach

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  is_deleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  delete_date: string
}
