import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Team } from './Team'
import { Tournament } from './Tournament'
@Entity()
export class Sponsor {
  @PrimaryGeneratedColumn()
  sponsor_id: number

  @Column({
    type: 'nvarchar',
    length: '75'
  })
  brand_name: string

  @ManyToMany(() => Team, (team) => team.sponsor)
  team: Team[]

  @ManyToMany(() => Tournament)
  @JoinTable()
  tournament: Tournament[]

  @Column({
    default: false
  })
  is_deleted: boolean
}
