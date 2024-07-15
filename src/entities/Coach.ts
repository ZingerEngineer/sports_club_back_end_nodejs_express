import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Team } from './Team'

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  coachId: number

  @OneToOne(() => User, (user) => user.coach, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  user: User

  @OneToOne(() => Team, (team) => team.coach, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  team: Team

  @Column({
    default: 0,
    type: 'numeric',
    precision: 7,
    scale: 2
  })
  salary: number
}
