import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  DeleteDateColumn
} from 'typeorm'
import { Team } from './Team'
import { Match } from './Match'
import { IsDeleted } from '../enums/globalEnums'
@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  sportId: number

  @Column({
    type: 'nvarchar',
    length: '75'
  })
  name: string

  @Column({
    type: 'nvarchar',
    length: '250'
  })
  description: string

  @Column({
    type: 'nvarchar',
    length: '400'
  })
  rules: string

  @Column({
    type: 'datetime',
    default: () => 'GETUTCDATE()',
    nullable: false
  })
  createdAt: string

  @Column({
    type: 'int',
    width: 1,
    nullable: false,
    default: IsDeleted.EXISTS
  })
  isDeleted: number

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: string

  @OneToMany(() => Team, (teams) => teams.sport, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete'
  })
  teams: Team[]

  @OneToMany(() => Match, (matches) => matches.sport, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete'
  })
  matches: Match[]
}
