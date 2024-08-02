import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './User'
@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  tokenId: number

  @ManyToOne(() => User, (user) => user.tokens)
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
    nullable: true
  })
  token: string

  @Column({
    type: 'datetime',
    default: () => 'GETUTCDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    default: 1,
    nullable: false
  })
  tokenUseTimes: number
}
