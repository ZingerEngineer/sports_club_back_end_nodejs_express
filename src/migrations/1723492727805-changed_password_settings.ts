import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangedPasswordSettings1723492727805
  implements MigrationInterface
{
  name = 'ChangedPasswordSettings1723492727805'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "password" varchar(MAX)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "password" varchar(40)`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`
    )
  }
}

