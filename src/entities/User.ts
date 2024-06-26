import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne
} from 'typeorm'
import { Team_member } from './Team_member'
import { Coach } from './Coach'
import { IsDeleted } from '../enums/globalEnums'

export enum UserRoles {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user'
}

export enum UserJobs {
  GUEST = 'guest',
  TEAMMEMBER = 'team_member',
  COACH = 'coach'
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column({
    type: 'nvarchar',
    length: 15,
    default: UserRoles.USER,
    nullable: false
  })
  role: string

  @Column({
    type: 'nvarchar',
    length: 25,
    default: 'Guest',
    nullable: false
  })
  first_name: string

  @Column({
    type: 'nvarchar',
    length: 25,
    default: '',
    nullable: false
  })
  last_name: string

  @Column({
    type: 'date',
    default: '',
    nullable: false
  })
  dob: Date

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    default: UserJobs.GUEST
  })
  job: string

  @OneToMany(() => Team_member, (team_member) => team_member.user)
  team_member: Team_member

  @OneToOne(() => Coach, (coach) => coach.user)
  coach: Coach

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  is_deleted: number
}

