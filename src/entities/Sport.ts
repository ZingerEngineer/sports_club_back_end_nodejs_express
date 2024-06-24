import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm'
import { Team } from './Team'
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
  @Column()
  isDeleted: boolean

  @OneToMany(() => Team, (team) => team.sport)
  team: Team[]
}
