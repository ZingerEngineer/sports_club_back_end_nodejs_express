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
import { UserGenders, UserJobs, UserRoles } from '../enums/user.enums'
import { Session } from './Session'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({
    type: 'nvarchar',
    length: 15,
    default: UserRoles.USER,
    nullable: false
  })
  role: UserRoles

  @OneToOne(() => Session, (session) => session.user, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    nullable: false
  })
  @JoinColumn({
    name: 'sessionId'
  })
  session: Session

  @Column({
    type: 'varchar',
    length: 15,
    default: '',
    nullable: false
  })
  phone: string

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
    type: 'nvarchar',
    length: 10,
    default: '',
    nullable: false
  })
  gender: UserGenders

  @Column({
    type: 'date',
    default: '',
    nullable: false
  })
  dob: Date

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
  job: UserJobs

  @OneToMany(() => TeamMember, (teamMembers) => teamMembers.user)
  teamMembers: TeamMember

  @OneToOne(() => Coach, (coach) => coach.user)
  coach: Coach

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: Date

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  isDeleted: IsDeleted

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: Date
}

