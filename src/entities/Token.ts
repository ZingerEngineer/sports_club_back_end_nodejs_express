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
    type: 'varchar',
    nullable: false
  })
  expiresIn: string

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: false
  })
  tokenBody: string

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: Date

  @Column({
    type: 'varchar',
    default: TokenTypes.SAFETY,
    nullable: false
  })
  tokenType: TokenTypes

  @Column({
    type: 'int',
    default: 1,
    nullable: false
  })
  tokenUseTimes: number
}
