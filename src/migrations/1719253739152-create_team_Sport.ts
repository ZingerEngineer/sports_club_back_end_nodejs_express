import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTeamSport1719253739152 implements MigrationInterface {
    name = 'CreateTeamSport1719253739152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team" ("team_id" int NOT NULL IDENTITY(1,1), "team_name" nvarchar(255) NOT NULL, "team_type" nvarchar(255) NOT NULL CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822" DEFAULT 'candidates', "below_age" int NOT NULL, "matches_won" int NOT NULL, "matches_lost" int NOT NULL, "sport_id" int NOT NULL, CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`);
        await queryRunner.query(`CREATE TABLE "sport" ("sport_id" int NOT NULL IDENTITY(1,1), "sport_name" nvarchar(75) NOT NULL, "sport_description" nvarchar(250) NOT NULL, "sport_rules" nvarchar(400) NOT NULL, "isDeleted" bit NOT NULL, CONSTRAINT "PK_85896d8d20cf619732a5c1fd727" PRIMARY KEY ("sport_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }

}
