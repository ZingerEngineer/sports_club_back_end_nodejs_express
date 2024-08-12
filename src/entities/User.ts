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
  UserJobs,
  UserRoles,
  UserEmailVerificationState
} from '../enums/user.enums'
import { Token } from './Token'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({
    type: 'nvarchar',
    nullable: true,
    length: 'MAX'
  })
  userGoogleId: string

  @Column({
    type: 'nvarchar',
    nullable: true,
    length: 'MAX'
  })
  userFaceBookId: string

  @Column({
    type: 'nvarchar',
    nullable: true,
    length: 'MAX'
  })
  userGitHubId: string

  @Column({
    type: 'nvarchar',
    nullable: true
  })
  profilePicture: string

  @Column({
    type: 'int',
    width: 1,
    default: UserRoles.USER,
    nullable: false
  })
  role: number

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
    type: 'datetime',
    nullable: true
  })
  emailVerifiedAt: string

  @Column({
    type: 'varchar',
    length: 40,
    default: '',
    nullable: true
  })
  email: string

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true
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
    nullable: true
  })
  gender: number

  @Column({
    type: 'date',
    nullable: true
  })
  dob: string

  @Column({
    type: 'int',
    nullable: true
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
