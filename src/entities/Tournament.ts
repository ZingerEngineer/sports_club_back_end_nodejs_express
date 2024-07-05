import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinColumn,
  OneToMany,
  DeleteDateColumn
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
  tournament_name: string

  @Column({
    type: 'datetime'
  })
  date_held: string

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

  @DeleteDateColumn({
    type: 'datetime'
  })
  delete_date: string
}
