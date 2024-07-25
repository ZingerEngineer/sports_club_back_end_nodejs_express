import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { TokenTypes } from '../enums/token.enums'
@Entity()
export class Token {
  @PrimaryColumn({
    type: 'varchar',
    length: 255
  })
  tokenId: string

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
  expiresIn: string

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    default: '',
    nullable: false
  })
  tokenBody: string

  @Column({
    type: 'datetime',
    default: () => 'GETUTCDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    width: 1,
    default: TokenTypes.SAFETY,
    nullable: false
  })
  tokenType: number

  @Column({
    type: 'int',
    default: 1,
    nullable: false
  })
  tokenUseTimes: number
}
