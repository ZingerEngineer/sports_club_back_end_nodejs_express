import { MigrationInterface, QueryRunner } from 'typeorm'

export class DeletingSessionTable1722543268870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "session"`)
  }
}

