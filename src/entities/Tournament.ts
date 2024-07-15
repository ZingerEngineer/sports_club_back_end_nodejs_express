import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToMany
} from 'typeorm'
import { Match } from './Match'
import { IsDeleted } from '../enums/globalEnums'
import { Sponsor } from './Sponsor'

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  tournamentId: number

  @Column({
    type: 'nvarchar',
    length: '120'
  })
  tournamentName: string

  @OneToMany(() => Match, (matches) => matches.tournament, {
    nullable: false
  })
  matches: Match[]

  @ManyToMany(() => Sponsor, (sponsors) => sponsors.tournaments)
  sponsors: Sponsor[]

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
