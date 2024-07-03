import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm'
import { User } from './User'
import { Team } from './Team'
import { IsDeleted } from '../enums/globalEnums'

@Entity()
export class Team_member {
  @PrimaryGeneratedColumn()
  team_mem_id: number

  @ManyToOne(() => User, (user) => user.team_member, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Team, (team) => team.team_member, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'team_id'
  })
  team: Team

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
    default: 'Guest'
  })
  match_role: string

  @Column({
    type: 'int',
    width: 4,
    nullable: false,
    default: 0
  })
  goals: number

  @Column({
    type: 'int',
    width: 4,
    nullable: false,
    default: 0
  })
  saves: number

  @Column({
    type: 'int',
    width: 4,
    nullable: false,
    default: 0
  })
  assists: number

  @Column({
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
