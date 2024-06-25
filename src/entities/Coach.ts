import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  coach_id: number

  @OneToOne(() => User, (user) => user.coach, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'user_id'
  })
  user: User

  @OneToOne(() => Team, (team) => team.coach, {
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
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
