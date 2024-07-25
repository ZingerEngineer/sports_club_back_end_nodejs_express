import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  DeleteDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { TeamMember } from './TeamMember'
import { Coach } from './Coach'
import { IsDeleted } from '../enums/globalEnums'
import {
  UserGenders,
  UserJobs,
  UserRoles,
  UserEmailVerificationState
} from '../enums/user.enums'
import { Session } from './Session'
import { Token } from './Token'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({
    type: 'int',
    width: 1,
    default: UserRoles.USER,
    nullable: false
  })
  role: number

  @OneToMany(() => Session, (sessions) => sessions.user, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete'
  })
  @JoinColumn({
    name: 'sessions'
  })
  sessions: Session[]

  @OneToMany(() => Token, (tokens) => tokens.user, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'tokens'
  })
  tokens: Token[]

  @Column({
    type: 'nvarchar',
    length: 15,
    default: '',
    nullable: false
  })
  phone: string

  @Column({
    type: 'int',
    width: 1,
    default: UserEmailVerificationState.UNVERIFIED,
    nullable: false
  })
  emailVerified: number

  @Column({
    type: 'varchar',
    length: 40,
    default: '',
    nullable: false
  })
  email: string

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false
  })
  password: string

  @Column({
    type: 'nvarchar',
    length: 25,
    default: 'Guest',
    nullable: false
  })
  firstName: string

  @Column({
    type: 'nvarchar',
    length: 25,
    default: '',
    nullable: false
  })
  lastName: string

  @Column({
    type: 'int',
    width: 1,
    default: UserGenders.MALE,
    nullable: false
  })
  gender: number

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
    type: 'int',
    width: 1,
    nullable: false,
    default: UserJobs.GUEST
  })
  job: number

  @OneToMany(() => TeamMember, (teamMembers) => teamMembers.user)
  @JoinColumn({
    name: 'teamMemberId'
  })
  teamMembers: TeamMember

  @OneToOne(() => Coach, (coach) => coach.user)
  @JoinColumn({
    name: 'coachId'
  })
  coach: Coach

  @Column({
    type: 'datetime',
    default: () => 'GETUTCDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  isDeleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: string
}

