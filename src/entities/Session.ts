import {
  Entity,
  Column,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { User } from './User'

@Entity()
export class Session {
  @PrimaryColumn({
    type: 'varchar',
    length: 255
  })
  sessionId: string

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({
    name: 'userId'
  })
  user: User

  @Column({
    type: 'datetime',
    default: () => 'DATEADD(MINUTE,60,GETUTCDATE())',
    nullable: false
  })
  expiresAt: string

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    default: '',
    nullable: false
  })
  data: string

  @Column({
    type: 'datetime',
    default: () => 'GETUTCDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'datetime',
    nullable: true
  })
  lastReplacedAt: string
}
