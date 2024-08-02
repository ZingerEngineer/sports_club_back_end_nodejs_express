import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangedTokenMaxLength1722568350129 implements MigrationInterface {
  name = 'ChangedTokenMaxLength1722568350129'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`)
    await queryRunner.query(`ALTER TABLE "token" ADD "token" nvarchar(MAX)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`)
    await queryRunner.query(`ALTER TABLE "token" ADD "token" nvarchar(255)`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`
    )
  }
}

