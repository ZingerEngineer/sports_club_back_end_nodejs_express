import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedOneToOneRelationTeamAndCoach1722360904853 implements MigrationInterface {
    name = 'FixedOneToOneRelationTeamAndCoach1722360904853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" ADD "coachCoachId" int`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresIn"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_38472b1e228510a09b388cdab8" ON "team" ("coachCoachId") WHERE "coachCoachId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_38472b1e228510a09b388cdab85" FOREIGN KEY ("coachCoachId") REFERENCES "coach"("coachId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_38472b1e228510a09b388cdab85"`);
        await queryRunner.query(`DROP INDEX "REL_38472b1e228510a09b388cdab8" ON "team"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresIn"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "coachCoachId"`);
    }

}
