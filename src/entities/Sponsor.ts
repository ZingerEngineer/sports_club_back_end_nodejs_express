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
  sponsorId: number

  @Column({
    type: 'nvarchar',
    length: '75'
  })
  name: string

  @ManyToMany(() => Team, (teams) => teams.sponsors, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete'
  })
  @JoinTable({
    name: 'sponsored_teams',
    joinColumn: {
      name: 'sponsorId',
      referencedColumnName: 'sponsorId'
    },
    inverseJoinColumn: {
      name: 'teamId',
      referencedColumnName: 'teamId'
    }
  })
  teams: Team[]

  @ManyToMany(() => Tournament, (tournaments) => tournaments.sponsors, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete'
  })
  @JoinTable({
    name: 'sponsored_tournaments',
    joinColumn: {
      name: 'sponsorId',
      referencedColumnName: 'sponsorId'
    },
    inverseJoinColumn: {
      name: 'tournamentId',
      referencedColumnName: 'tournamentId'
    }
  })
  tournaments: Tournament[]

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    width: 1,
    default: IsDeleted.EXISTS,
    nullable: false
  })
  isDeleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: string
}
