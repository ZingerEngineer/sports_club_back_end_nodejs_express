import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { User } from './User'
@Entity()
export class Session {
  @PrimaryColumn({
    type: 'varchar',
    length: 255
  })
  sessionId: string

  @OneToOne(() => User, (user) => user.session)
  @JoinColumn({
    name: 'userId'
  })
  user: User

  @Column({
    type: 'timestamp',
    nullable: false
  })
  expiresAt: number

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    default: '',
    nullable: false
  })
  data: string

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: Date

  @Column({
    type: 'datetime',
    default: '',
    nullable: false
  })
  lastReplacedAt: Date
}
