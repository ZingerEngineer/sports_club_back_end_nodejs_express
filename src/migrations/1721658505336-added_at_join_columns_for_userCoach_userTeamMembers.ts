import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAtJoinColumnsForUserCoachUserTeamMembers1721658505336 implements MigrationInterface {
    name = 'AddedAtJoinColumnsForUserCoachUserTeamMembers1721658505336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "coachId" int`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_e5eab302deb1aded146a15984e" ON "user" ("coachId") WHERE "coachId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_e5eab302deb1aded146a15984e7" FOREIGN KEY ("coachId") REFERENCES "coach"("coachId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_e5eab302deb1aded146a15984e7"`);
        await queryRunner.query(`DROP INDEX "REL_e5eab302deb1aded146a15984e" ON "user"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coachId"`);
    }

}
