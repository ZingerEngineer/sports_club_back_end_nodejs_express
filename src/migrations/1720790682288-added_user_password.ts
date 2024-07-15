import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserPassword1720790682288 implements MigrationInterface {
    name = 'AddedUserPassword1720790682288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "won_team_match" ADD CONSTRAINT "FK_a555138469f01b1405bca488377" FOREIGN KEY ("won_team_id") REFERENCES "team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lost_team_match" ADD CONSTRAINT "FK_c7cc2ea6232e1c92fcae7ac1d09" FOREIGN KEY ("lost_team_id") REFERENCES "team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_c7cc2ea6232e1c92fcae7ac1d09"`);
        await queryRunner.query(`ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_a555138469f01b1405bca488377"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
