import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedGmailUserColumns1722462762707 implements MigrationInterface {
  name = 'AddedGmailUserColumns1722462762707'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userGoogleId" nvarchar(100)`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profilePicture" nvarchar(255)`
    )
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`
    )
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresIn"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_4ec92b7a3b6eca6881a3f1b6341"`
    )
    await queryRunner.query(
      `DROP INDEX "REL_4ec92b7a3b6eca6881a3f1b634" ON "team"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresIn"`
    )
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`
    )
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePicture"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userGoogleId"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "coachId"`)
  }
}

