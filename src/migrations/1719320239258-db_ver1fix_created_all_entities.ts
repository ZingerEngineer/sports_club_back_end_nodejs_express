import { MigrationInterface, QueryRunner } from 'typeorm'

export class DbVer1fixCreatedAllEntities1719320239258
  implements MigrationInterface
{
  name = 'DbVer1fixCreatedAllEntities1719320239258'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "sport" ("sport_id" int NOT NULL IDENTITY(1,1), "sport_name" nvarchar(75) NOT NULL, "sport_description" nvarchar(250) NOT NULL, "sport_rules" nvarchar(400) NOT NULL, "is_deleted" bit NOT NULL CONSTRAINT "DF_e29739e3bbfd72898a5db861a57" DEFAULT 0, CONSTRAINT "PK_85896d8d20cf619732a5c1fd727" PRIMARY KEY ("sport_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "match" ("match_id" int NOT NULL IDENTITY(1,1), "match_type" nvarchar(50) NOT NULL, "date_held" date NOT NULL, "match_duration" int NOT NULL, "pending" bit NOT NULL CONSTRAINT "DF_c705fae408c70ef24a5a97e538e" DEFAULT 1, "is_deleted" bit NOT NULL CONSTRAINT "DF_22a542498dfa76e38b506b73ee9" DEFAULT 0, "sportSportId" int, "tournamentTournamentId" int, CONSTRAINT "PK_2e7d516f3dc97d9e2f882212d2b" PRIMARY KEY ("match_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "tournament" ("Tournament_id" int NOT NULL IDENTITY(1,1), "title" nvarchar(120) NOT NULL, "date_held" date NOT NULL, "matchMatchId" int, CONSTRAINT "PK_d3866f302171d87aa75a13f8179" PRIMARY KEY ("Tournament_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "sponsor" ("sponsor_id" int NOT NULL IDENTITY(1,1), "brand_name" nvarchar(75) NOT NULL, "is_deleted" bit NOT NULL CONSTRAINT "DF_e7275a819af5477f6a37e14e1b6" DEFAULT 0, CONSTRAINT "PK_2c853dd361a7c851f48f2f954b5" PRIMARY KEY ("sponsor_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "team" ("team_id" int NOT NULL IDENTITY(1,1), "team_name" nvarchar(255) NOT NULL, "team_type" nvarchar(255) NOT NULL CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822" DEFAULT 'candidates', "below_age" int NOT NULL, "matches_won" int NOT NULL, "matches_lost" int NOT NULL, "isDeleted" bit NOT NULL, "sportSportId" int, "teamMemberId" int, CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "team_member" ("id" int NOT NULL IDENTITY(1,1), "match_role" nvarchar(100) NOT NULL, "goals" int NOT NULL, "saves" int NOT NULL, "assists" int NOT NULL, "salary" numeric(7,2) NOT NULL, "userUserId" int, "teamTeamId" int, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("user_id" int NOT NULL IDENTITY(1,1), "role" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "dob" datetime NOT NULL, "job" nvarchar(255) NOT NULL, "reports_from" int NOT NULL, "reported_on" int NOT NULL, "isDeleted" bit NOT NULL, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "coach" ("coach_id" int NOT NULL IDENTITY(1,1), "salary" numeric(7,2) NOT NULL, "userUserId" int, "coachingTeamTeamId" int, CONSTRAINT "PK_79a8206bc16eaf7ea2b4fc02749" PRIMARY KEY ("coach_id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_9c72f703ac1ae36468e2e94c98" ON "coach" ("userUserId") WHERE "userUserId" IS NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_76b6a412907d2a6b13a8435c95" ON "coach" ("coachingTeamTeamId") WHERE "coachingTeamTeamId" IS NOT NULL`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "sponsor_tournament_tournament" ("sponsorSponsorId" int NOT NULL, "tournamentTournamentId" int NOT NULL, CONSTRAINT "PK_100046d6c3fcdde2421df8867fb" PRIMARY KEY ("sponsorSponsorId", "tournamentTournamentId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bad7755500dc4e76c18852302c" ON "sponsor_tournament_tournament" ("sponsorSponsorId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_44f0fdd6e18a8badf3ebbfe97d" ON "sponsor_tournament_tournament" ("tournamentTournamentId") `
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_f64073da09abc013b62256fb668" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf" FOREIGN KEY ("tournamentTournamentId") REFERENCES "tournament"("Tournament_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "FK_8a95eff0fbd3fa37e7dbbc781d8" FOREIGN KEY ("matchMatchId") REFERENCES "match"("match_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_3c43702f4fa9af7a917cd006829" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_99574f16e2b0f4f2de38bf1c479" FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_7678387ec9659186501c236aabc" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6" FOREIGN KEY ("teamTeamId") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "FK_9c72f703ac1ae36468e2e94c98a" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "FK_76b6a412907d2a6b13a8435c957" FOREIGN KEY ("coachingTeamTeamId") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor_tournament_tournament" ADD CONSTRAINT "FK_bad7755500dc4e76c18852302c0" FOREIGN KEY ("sponsorSponsorId") REFERENCES "sponsor"("sponsor_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor_tournament_tournament" ADD CONSTRAINT "FK_44f0fdd6e18a8badf3ebbfe97dd" FOREIGN KEY ("tournamentTournamentId") REFERENCES "tournament"("Tournament_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sponsor_tournament_tournament" DROP CONSTRAINT "FK_44f0fdd6e18a8badf3ebbfe97dd"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor_tournament_tournament" DROP CONSTRAINT "FK_bad7755500dc4e76c18852302c0"`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "FK_76b6a412907d2a6b13a8435c957"`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "FK_9c72f703ac1ae36468e2e94c98a"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_7678387ec9659186501c236aabc"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_99574f16e2b0f4f2de38bf1c479"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_3c43702f4fa9af7a917cd006829"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "FK_8a95eff0fbd3fa37e7dbbc781d8"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_f64073da09abc013b62256fb668"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_44f0fdd6e18a8badf3ebbfe97d" ON "sponsor_tournament_tournament"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_bad7755500dc4e76c18852302c" ON "sponsor_tournament_tournament"`
    )
    await queryRunner.query(`DROP TABLE "sponsor_tournament_tournament"`)
    await queryRunner.query(
      `DROP INDEX "REL_76b6a412907d2a6b13a8435c95" ON "coach"`
    )
    await queryRunner.query(
      `DROP INDEX "REL_9c72f703ac1ae36468e2e94c98" ON "coach"`
    )
    await queryRunner.query(`DROP TABLE "coach"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "team_member"`)
    await queryRunner.query(`DROP TABLE "team"`)
    await queryRunner.query(`DROP TABLE "sponsor"`)
    await queryRunner.query(`DROP TABLE "tournament"`)
    await queryRunner.query(`DROP TABLE "match"`)
    await queryRunner.query(`DROP TABLE "sport"`)
  }
}

