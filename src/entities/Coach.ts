import { Column, Entity, OneToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class Coach {
  @OneToOne(() => User)
  @JoinColumn()
  coach_id: User

  @OneToOne(() => Team)
  @JoinColumn()
  coaching_team: Team

  @Column({
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
