import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedUserSessionId1721055704213 implements MigrationInterface {
  name = 'AddedUserSessionId1721055704213'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("sessionId" varchar(255) NOT NULL, "expiresAt" timestamp NOT NULL, "data" nvarchar(MAX) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_1063954fd0fa5e655cc482fb5c7" DEFAULT GETDATE(), "userId" int, CONSTRAINT "PK_6f8fc3d2111ccc30d98e173d8dd" PRIMARY KEY ("sessionId"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") WHERE "userId" IS NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "sessionId" varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_b22c6791e58b087bea5ac53a1a" ON "user" ("sessionId") WHERE "sessionId" IS NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b22c6791e58b087bea5ac53a1a2" FOREIGN KEY ("sessionId") REFERENCES "session"("sessionId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_b22c6791e58b087bea5ac53a1a2"`
    )
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`
    )
    await queryRunner.query(
      `DROP INDEX "REL_b22c6791e58b087bea5ac53a1a" ON "user"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sessionId"`)
    await queryRunner.query(
      `DROP INDEX "REL_3d2f174ef04fb312fdebd0ddc5" ON "session"`
    )
    await queryRunner.query(`DROP TABLE "session"`)
  }
}

