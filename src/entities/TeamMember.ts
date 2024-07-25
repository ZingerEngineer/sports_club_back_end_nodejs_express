import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  teamMemberId: number

  @ManyToOne(() => User, (user) => user.teamMembers, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'userId'
  })
  user: User

  @ManyToOne(() => Team, (team) => team.teamMembers, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'teamId'
  })
  team: Team

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
    default: 'Guest'
  })
  matchRole: string

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
