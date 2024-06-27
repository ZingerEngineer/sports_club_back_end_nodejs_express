import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm'
import { Team } from './Team'
import { Match } from './Match'
import { IsDeleted } from '../enums/globalEnums'
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
  @Column({
    type: 'int',
    width: 1,
    nullable: false,
    default: IsDeleted.EXISTS
  })
  is_deleted: number

  @OneToMany(() => Team, (team) => team.sport)
  team: Team[]

  @OneToMany(() => Match, (match) => match.sport)
  match: Match[]
}
