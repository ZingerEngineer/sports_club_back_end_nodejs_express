import { MigrationInterface, QueryRunner } from 'typeorm'

export class DeletedSessionEntityAndRepo1722535292748
  implements MigrationInterface
{
  name = 'DeletedSessionEntityAndRepo1722535292748'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_b359a8a84f7a301f66bc0b3c083"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenBody"`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenType"`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresIn"`)
    await queryRunner.query(
      `ALTER TABLE "token" ADD "expiresAt" datetime NOT NULL CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE())`
    )
    await queryRunner.query(`ALTER TABLE "token" ADD "token" nvarchar(255)`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "PK_bb402e674ae9363a98e291ac2b7"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenId"`)
    await queryRunner.query(
      `ALTER TABLE "token" ADD "tokenId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "PK_bb402e674ae9363a98e291ac2b7" PRIMARY KEY ("tokenId")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "PK_bb402e674ae9363a98e291ac2b7"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenId"`)
    await queryRunner.query(
      `ALTER TABLE "token" ADD "tokenId" varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "PK_bb402e674ae9363a98e291ac2b7" PRIMARY KEY ("tokenId")`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`)
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresAt"`)
    await queryRunner.query(
      `ALTER TABLE "token" ADD "expiresIn" datetime NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresIn"`
    )
    await queryRunner.query(`ALTER TABLE "token" ADD "tokenType" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2" DEFAULT 0 FOR "tokenType"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD "tokenBody" nvarchar(MAX) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_b359a8a84f7a301f66bc0b3c083" DEFAULT '' FOR "tokenBody"`
    )
  }
}

