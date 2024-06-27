import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm'
import { Team } from './Team'
import { Tournament } from './Tournament'
import { IsDeleted } from '../enums/globalEnums'
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
  @JoinColumn({
    name: 'team_id'
  })
  team: Team[]

  @ManyToMany(() => Tournament)
  @JoinTable()
  tournament: Tournament[]

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  is_deleted: number
}
