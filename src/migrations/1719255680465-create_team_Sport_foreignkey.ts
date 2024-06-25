import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTeamSportForeignkey1719255680465
  implements MigrationInterface
{
  name = 'CreateTeamSportForeignkey1719255680465'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `IF NOT (EXISTS( SELECT * FROM sys.tables WHERE name = 'user')) 
      CREATE TABLE "user" ("user_id" int NOT NULL IDENTITY(1,1), "role" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "team" int NOT NULL, "dob" datetime NOT NULL, "job" nvarchar(255) NOT NULL, "reports_from" int NOT NULL, "reported_on" int NOT NULL, "isDeleted" bit NOT NULL, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`
    )
    await queryRunner.query(
      `
      IF NOT (EXISTS(SELECT * FROM sys.tables WHERE name = 'sport'))
      CREATE TABLE "sport" ("sport_id" int NOT NULL IDENTITY(1,1), "sport_name" nvarchar(75) NOT NULL, "sport_description" nvarchar(250) NOT NULL, "sport_rules" nvarchar(400) NOT NULL, "isDeleted" bit NOT NULL, CONSTRAINT "PK_85896d8d20cf619732a5c1fd727" PRIMARY KEY ("sport_id"))`
    )
    await queryRunner.query(
      `
       IF NOT (EXISTS(SELECT * FROM sys.tables WHERE name = 'team'))
      CREATE TABLE "team" ("team_id" int NOT NULL IDENTITY(1,1), "team_name" nvarchar(255) NOT NULL, "team_type" nvarchar(255) NOT NULL CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822" DEFAULT 'candidates', "below_age" int NOT NULL, "matches_won" int NOT NULL, "matches_lost" int NOT NULL, "sportSportId" int, CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_3c43702f4fa9af7a917cd006829" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_3c43702f4fa9af7a917cd006829"`
    )
    await queryRunner.query(`
        IF (EXISTS(SELECT * FROM sys.tables WHERE name = 'match'))
        DROP TABLE "team"`)
    await queryRunner.query(`
        IF (EXISTS(SELECT * FROM sys.tables WHERE name = 'match'))
        DROP TABLE "sport"`)
    await queryRunner.query(`
        IF (EXISTS(SELECT * FROM sys.tables WHERE name = 'match'))
        DROP TABLE "user"`)
  }
}

