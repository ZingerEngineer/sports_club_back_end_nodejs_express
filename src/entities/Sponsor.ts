import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  DeleteDateColumn
} from 'typeorm'
import { Team } from './Team'
import { Tournament } from './Tournament'
import { IsDeleted } from '../enums/globalEnums'
@Entity()
export class Sponsor {
  @PrimaryGeneratedColumn()
  sponsor_id: number

  @Column({
    type: 'nvarchar',
    length: '75'
  })
  brand_name: string

  @ManyToMany(() => Team, (team) => team.sponsor)
  @JoinTable({
    name: 'sponsored_teams',
    joinColumn: {
      name: 'sponsor_id',
      referencedColumnName: 'sponsor_id'
    },
    inverseJoinColumn: {
      name: 'team_id',
      referencedColumnName: 'team_id'
    }
  })
  team: Team[]

  @ManyToMany(() => Tournament)
  @JoinTable({
    name: 'sponsored_tournaments',
    joinColumn: {
      name: 'sponsor_id',
      referencedColumnName: 'sponsor_id'
    },
    inverseJoinColumn: {
      name: 'tournament_id',
      referencedColumnName: 'tournament_id'
    }
  })
  tournament: Tournament[]

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
