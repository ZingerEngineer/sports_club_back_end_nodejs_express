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

  @OneToOne(() => User, (user) => user.user_id)
  @JoinColumn({
    name: 'user_id'
  })
  user: User

  @OneToOne(() => Team, (team) => team.team_id)
  @JoinColumn()
  coaching_team: Team

  @Column({
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
