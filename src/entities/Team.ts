import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne
} from 'typeorm'
import { Sport } from './Sport'
import { Sponsor } from './Sponsor'
import { Team_member } from './Team_member'
import { Coach } from './Coach'

export enum TeamType {
  CANDIDATES = 'candidates',
  AMATURES = 'amatures',
  INTERNATIONAL = 'international'
}
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number

  @Column()
  team_name: string

  @Column({
    type: 'nvarchar',
    default: 'candidates'
  })
  team_type: string

  @Column({
    type: 'int',
    width: 2
  })
  below_age: number

  @Column()
  matches_won: number

  @Column()
  matches_lost: number

  @ManyToOne(() => Sport, (sport) => sport.team)
  sport: Sport[]

  @ManyToMany(() => Sponsor, (sponsor) => sponsor.team)
  sponsor: Sponsor[]

  @ManyToOne(() => Team_member, (team_member) => team_member.team)
  team_member: Team_member

  @OneToOne(() => Coach, (coach) => coach.team, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete'
  })
  coach: Coach

  @Column()
  isDeleted: boolean
}
