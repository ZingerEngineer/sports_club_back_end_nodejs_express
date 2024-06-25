import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany
} from 'typeorm'
import { Sport } from './Sport'
import { Sponsor } from './Sponsor'

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

  @Column()
  isDeleted: boolean
}
