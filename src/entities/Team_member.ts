import { Column, Entity, OneToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class Team_member {
  @OneToOne(() => User)
  @JoinColumn()
  coach_id: User

  @OneToOne(() => Team)
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
