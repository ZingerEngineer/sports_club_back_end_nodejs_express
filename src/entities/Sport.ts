import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm'
import { Team } from './Team'
import { Match } from './Match'
@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  sport_id: number

  @Column({
    type: 'nvarchar',
    length: '75'
  })
  sport_name: string

  @Column({
    type: 'nvarchar',
    length: '250'
  })
  sport_description: string

  @Column({
    type: 'nvarchar',
    length: '400'
  })
  sport_rules: string
  @Column({ default: false })
  is_deleted: boolean

  @OneToMany(() => Team, (team) => team.sport)
  team: Team[]

  @OneToMany(() => Match, (match) => match.sport)
  match: Match[]
}
