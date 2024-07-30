import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedOneToOneRelationTeamAndCoachJoinColumnName1722361005564 implements MigrationInterface {
    name = 'ChangedOneToOneRelationTeamAndCoachJoinColumnName1722361005564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_38472b1e228510a09b388cdab85"`);
        await queryRunner.query(`DROP INDEX "REL_38472b1e228510a09b388cdab8" ON "team"`);
        await queryRunner.query(`EXEC sp_rename "sports_club.dbo.team.coachCoachId", "coachId"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresIn"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_4ec92b7a3b6eca6881a3f1b634" ON "team" ("coachId") WHERE "coachId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_4ec92b7a3b6eca6881a3f1b6341" FOREIGN KEY ("coachId") REFERENCES "coach"("coachId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_4ec92b7a3b6eca6881a3f1b6341"`);
        await queryRunner.query(`DROP INDEX "REL_4ec92b7a3b6eca6881a3f1b634" ON "team"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresIn"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
        await queryRunner.query(`EXEC sp_rename "sports_club.dbo.team.coachId", "coachCoachId"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_38472b1e228510a09b388cdab8" ON "team" ("coachCoachId") WHERE ([coachCoachId] IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_38472b1e228510a09b388cdab85" FOREIGN KEY ("coachCoachId") REFERENCES "coach"("coachId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
