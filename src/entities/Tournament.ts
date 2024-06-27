import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { Match } from './Match'
import { IsDeleted } from '../enums/globalEnums'

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  tournament_id: number

  @Column({
    type: 'nvarchar',
    length: '120'
  })
  title: string

  @Column({
    type: 'date'
  })
  date_held: Date

  @OneToMany(() => Match, (match) => match.tournament, {
    nullable: false
  })
  @JoinColumn({
    name: 'match_id'
  })
  match: Match[]

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  is_deleted: number
}
