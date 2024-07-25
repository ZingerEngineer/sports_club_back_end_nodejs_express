import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedTheRelationBetweenSessionsAndUser1721660159078 implements MigrationInterface {
    name = 'ChangedTheRelationBetweenSessionsAndUser1721660159078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b22c6791e58b087bea5ac53a1a2"`);
        await queryRunner.query(`DROP INDEX "REL_3d2f174ef04fb312fdebd0ddc5" ON "session"`);
        await queryRunner.query(`DROP INDEX "REL_b22c6791e58b087bea5ac53a1a" ON "user"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sessionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "sessionId" varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_b22c6791e58b087bea5ac53a1a" ON "user" ("sessionId") WHERE ([sessionId] IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") WHERE ([userId] IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b22c6791e58b087bea5ac53a1a2" FOREIGN KEY ("sessionId") REFERENCES "session"("sessionId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
