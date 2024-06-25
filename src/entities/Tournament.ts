import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm'
import { Match } from './Match'

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  Tournament_id: number

  @Column({
    type: 'nvarchar',
    length: '120'
  })
  title: string

  @Column({
    type: 'date'
  })
  date_held: Date

  @ManyToOne(() => Match, (match) => match.tournament)
  match: Match[]
}
