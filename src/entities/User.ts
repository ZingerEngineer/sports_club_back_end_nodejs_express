import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  DeleteDateColumn,
  JoinTable
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
  dob: string

  @Column({
    type: 'int',
    default: 0,
    nullable: false
  })
  age: number

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    default: UserJobs.GUEST
  })
  job: string

  @ManyToMany(() => Team_member, (teamMember) => teamMember.user)
  @JoinTable({
    name: 'team_member_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id'
    },
    inverseJoinColumn: {
      name: 'team_mem_id',
      referencedColumnName: 'team_mem_id'
    }
  })
  Team_member: Team_member
  @ManyToMany(() => Coach, (coach) => coach.user)
  @JoinTable({
    name: 'coach_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id'
    },
    inverseJoinColumn: {
      name: 'coach_id',
      referencedColumnName: 'user_id'
    }
  })
  coach: Coach
  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  is_deleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  delete_date: string
}

