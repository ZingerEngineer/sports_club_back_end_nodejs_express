import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class Team_member {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.team_member)
  @JoinColumn({
    name: 'user_id'
  })
  user: User

  @ManyToOne(() => Team, (team) => team.team_member)
  @JoinColumn()
  team: Team

  @Column({
    type: 'nvarchar',
    length: 100
  })
  match_role: string
  @Column({
    type: 'int'
  })
  goals: number

  @Column({
    type: 'int'
  })
  saves: number

  @Column({
    type: 'int'
  })
  assists: number

  @Column({
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
