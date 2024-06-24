import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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
  team: number

  @Column()
  dob: Date

  @Column()
  job: string

  @Column()
  reports_from: number

  @Column()
  reported_on: number

  @Column()
  isDeleted: boolean
}

