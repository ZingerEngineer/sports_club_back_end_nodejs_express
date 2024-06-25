import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Team_member } from './Team_member'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column()
  role: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  dob: Date

  @Column()
  job: string

  @Column()
  reports_from: number

  @Column()
  reported_on: number

  @OneToMany(() => Team_member, (team_member) => team_member.user)
  team_member: Team_member

  @Column()
  isDeleted: boolean
}

