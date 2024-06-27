import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1719505595128 implements MigrationInterface {
    name = 'Init1719505595128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournament" ("tournament_id" int NOT NULL IDENTITY(1,1), "title" nvarchar(120) NOT NULL, "date_held" date NOT NULL, "is_deleted" int NOT NULL CONSTRAINT "DF_9e2ea14906fc900f6a83b7281c5" DEFAULT 1, CONSTRAINT "PK_232f6973497284cc8acb7bf5efa" PRIMARY KEY ("tournament_id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("match_id" int NOT NULL IDENTITY(1,1), "match_type" nvarchar(50) NOT NULL CONSTRAINT "DF_7a1ffc439c724032b9b5f0b9f3f" DEFAULT 'scrimmage', "date_held" date NOT NULL, "match_duration" time(3) NOT NULL CONSTRAINT "DF_69b361844d37587ab8c5ba78b0c" DEFAULT '00:00:00.000', "is_deleted" int NOT NULL CONSTRAINT "DF_22a542498dfa76e38b506b73ee9" DEFAULT 1, "sport_id" int NOT NULL, "tournament_id" int, CONSTRAINT "PK_2e7d516f3dc97d9e2f882212d2b" PRIMARY KEY ("match_id"))`);
        await queryRunner.query(`CREATE TABLE "sport" ("sport_id" int NOT NULL IDENTITY(1,1), "sport_name" nvarchar(75) NOT NULL, "sport_description" nvarchar(250) NOT NULL, "sport_rules" nvarchar(400) NOT NULL, "is_deleted" int NOT NULL CONSTRAINT "DF_e29739e3bbfd72898a5db861a57" DEFAULT 1, CONSTRAINT "PK_85896d8d20cf619732a5c1fd727" PRIMARY KEY ("sport_id"))`);
        await queryRunner.query(`CREATE TABLE "sponsor" ("sponsor_id" int NOT NULL IDENTITY(1,1), "brand_name" nvarchar(75) NOT NULL, "is_deleted" int NOT NULL CONSTRAINT "DF_e7275a819af5477f6a37e14e1b6" DEFAULT 1, CONSTRAINT "PK_2c853dd361a7c851f48f2f954b5" PRIMARY KEY ("sponsor_id"))`);
        await queryRunner.query(`CREATE TABLE "coach" ("coach_id" int NOT NULL IDENTITY(1,1), "salary" numeric(7,2) NOT NULL CONSTRAINT "DF_557c533c54ad66db7d868179895" DEFAULT 0, "is_deleted" int NOT NULL CONSTRAINT "DF_d38549aa577cd4df571ffa9f27c" DEFAULT 1, "user_id" int NOT NULL, "team_id" int NOT NULL, CONSTRAINT "PK_79a8206bc16eaf7ea2b4fc02749" PRIMARY KEY ("coach_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_1f2795aa1fb31dd9444f96aa80" ON "coach" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_f1a19958cb90f5ea3879678a20" ON "coach" ("team_id") WHERE "team_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "team" ("team_id" int NOT NULL IDENTITY(1,1), "team_name" nvarchar(35) NOT NULL CONSTRAINT "DF_ce5064461c0676068e2e102fdcb" DEFAULT 'Guest team', "team_type" nvarchar(20) NOT NULL CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822" DEFAULT 'candidates', "below_age" int NOT NULL CONSTRAINT "DF_9ab811e45e7ca7b8156ca3cbf57" DEFAULT 15, "matches_won" int NOT NULL CONSTRAINT "DF_6197a70c77370f4e23ca2b12485" DEFAULT 0, "matches_lost" int NOT NULL CONSTRAINT "DF_6691c2460c5d9d7bc8835a5d00c" DEFAULT 0, "is_deleted" int NOT NULL CONSTRAINT "DF_536232a008de7a52034f46d5144" DEFAULT 1, "sport_id" int, "coach_id" int, CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_b2cccee84bc219af212d659017" ON "team" ("coach_id") WHERE "coach_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "team_member" ("team_mem_id" int NOT NULL IDENTITY(1,1), "match_role" nvarchar(100) NOT NULL CONSTRAINT "DF_c060f5779f961c1e63701a6092c" DEFAULT 'Guest', "goals" int NOT NULL CONSTRAINT "DF_2e2de380c410fd59f126367e9db" DEFAULT 0, "saves" int NOT NULL CONSTRAINT "DF_baf2fe7ffbe736bf7667147da52" DEFAULT 0, "assists" int NOT NULL CONSTRAINT "DF_dd5c11e0eb74eda7c927133551e" DEFAULT 0, "salary" numeric(7,2) NOT NULL, "is_deleted" int NOT NULL CONSTRAINT "DF_33148eb577b1e575470043de150" DEFAULT 1, "user_id" int NOT NULL, "team_id" int NOT NULL, CONSTRAINT "PK_9ee1ff741b18e49d7f7c71d2cc0" PRIMARY KEY ("team_mem_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" int NOT NULL IDENTITY(1,1), "role" nvarchar(15) NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 'user', "first_name" nvarchar(25) NOT NULL CONSTRAINT "DF_7a4fd2a547828e5efe420e50d1c" DEFAULT 'Guest', "last_name" nvarchar(25) NOT NULL CONSTRAINT "DF_6937e802be2946855a3ad0e6bef" DEFAULT '', "dob" date NOT NULL CONSTRAINT "DF_997a25036ba355bdad2d22cb29b" DEFAULT '', "job" nvarchar(20) NOT NULL CONSTRAINT "DF_a18f709c808e3bde52a89885006" DEFAULT 'guest', "is_deleted" int NOT NULL CONSTRAINT "DF_666851d8509be413462c3b150c0" DEFAULT 1, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "won_team_match" ("match_id" int NOT NULL, "won_team_id" int NOT NULL, CONSTRAINT "PK_02b345775e8e88c830e779df2f7" PRIMARY KEY ("match_id", "won_team_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83001daa64957bbb90e294256a" ON "won_team_match" ("match_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a555138469f01b1405bca48837" ON "won_team_match" ("won_team_id") `);
        await queryRunner.query(`CREATE TABLE "lost_team_match" ("match_id" int NOT NULL, "lost_team_id" int NOT NULL, CONSTRAINT "PK_3b9a1f8872f14d998cf818c7317" PRIMARY KEY ("match_id", "lost_team_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c09422def5cdd67b83311a34dd" ON "lost_team_match" ("match_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7cc2ea6232e1c92fcae7ac1d0" ON "lost_team_match" ("lost_team_id") `);
        await queryRunner.query(`CREATE TABLE "sponsored_teams" ("sponsor_id" int NOT NULL, "team_id" int NOT NULL, CONSTRAINT "PK_a9948c5253f687775b0ef99087a" PRIMARY KEY ("sponsor_id", "team_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea94596af0abda4d169c85d186" ON "sponsored_teams" ("sponsor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d3219adfdd12bfd95a16f7aa3" ON "sponsored_teams" ("team_id") `);
        await queryRunner.query(`CREATE TABLE "sponsored_tournaments" ("sponsor_id" int NOT NULL, "tournament_id" int NOT NULL, CONSTRAINT "PK_1bc07b0dc330af2a9791ae2a77d" PRIMARY KEY ("sponsor_id", "tournament_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_295053f84d1fb2ef7a67d4ae9f" ON "sponsored_tournaments" ("sponsor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7bc36e696b889a536cb0842ee8" ON "sponsored_tournaments" ("tournament_id") `);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_5e711f7b47b29cf65c10eb47cfa" FOREIGN KEY ("sport_id") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_9d2b6c364aa0b6fe81f25c9b87c" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("tournament_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_1f2795aa1fb31dd9444f96aa803" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_f1a19958cb90f5ea3879678a204" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_41027dbcf54d6d3fe158d6ab843" FOREIGN KEY ("sport_id") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_b2cccee84bc219af212d6590173" FOREIGN KEY ("coach_id") REFERENCES "coach"("coach_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_0724b86622f89c433dee4cd8b17" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_a1b5b4f5fa1b7f890d0a278748b" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "won_team_match" ADD CONSTRAINT "FK_83001daa64957bbb90e294256a2" FOREIGN KEY ("match_id") REFERENCES "match"("match_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "won_team_match" ADD CONSTRAINT "FK_a555138469f01b1405bca488377" FOREIGN KEY ("won_team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "lost_team_match" ADD CONSTRAINT "FK_c09422def5cdd67b83311a34dd4" FOREIGN KEY ("match_id") REFERENCES "match"("match_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "lost_team_match" ADD CONSTRAINT "FK_c7cc2ea6232e1c92fcae7ac1d09" FOREIGN KEY ("lost_team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_ea94596af0abda4d169c85d1864" FOREIGN KEY ("sponsor_id") REFERENCES "sponsor"("sponsor_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_4d3219adfdd12bfd95a16f7aa3b" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_295053f84d1fb2ef7a67d4ae9f8" FOREIGN KEY ("sponsor_id") REFERENCES "sponsor"("sponsor_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_7bc36e696b889a536cb0842ee83" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("tournament_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_7bc36e696b889a536cb0842ee83"`);
        await queryRunner.query(`ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_295053f84d1fb2ef7a67d4ae9f8"`);
        await queryRunner.query(`ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_4d3219adfdd12bfd95a16f7aa3b"`);
        await queryRunner.query(`ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_ea94596af0abda4d169c85d1864"`);
        await queryRunner.query(`ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_c7cc2ea6232e1c92fcae7ac1d09"`);
        await queryRunner.query(`ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_c09422def5cdd67b83311a34dd4"`);
        await queryRunner.query(`ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_a555138469f01b1405bca488377"`);
        await queryRunner.query(`ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_83001daa64957bbb90e294256a2"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_a1b5b4f5fa1b7f890d0a278748b"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_0724b86622f89c433dee4cd8b17"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b2cccee84bc219af212d6590173"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_41027dbcf54d6d3fe158d6ab843"`);
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_f1a19958cb90f5ea3879678a204"`);
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_1f2795aa1fb31dd9444f96aa803"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_9d2b6c364aa0b6fe81f25c9b87c"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_5e711f7b47b29cf65c10eb47cfa"`);
        await queryRunner.query(`DROP INDEX "IDX_7bc36e696b889a536cb0842ee8" ON "sponsored_tournaments"`);
        await queryRunner.query(`DROP INDEX "IDX_295053f84d1fb2ef7a67d4ae9f" ON "sponsored_tournaments"`);
        await queryRunner.query(`DROP TABLE "sponsored_tournaments"`);
        await queryRunner.query(`DROP INDEX "IDX_4d3219adfdd12bfd95a16f7aa3" ON "sponsored_teams"`);
        await queryRunner.query(`DROP INDEX "IDX_ea94596af0abda4d169c85d186" ON "sponsored_teams"`);
        await queryRunner.query(`DROP TABLE "sponsored_teams"`);
        await queryRunner.query(`DROP INDEX "IDX_c7cc2ea6232e1c92fcae7ac1d0" ON "lost_team_match"`);
        await queryRunner.query(`DROP INDEX "IDX_c09422def5cdd67b83311a34dd" ON "lost_team_match"`);
        await queryRunner.query(`DROP TABLE "lost_team_match"`);
        await queryRunner.query(`DROP INDEX "IDX_a555138469f01b1405bca48837" ON "won_team_match"`);
        await queryRunner.query(`DROP INDEX "IDX_83001daa64957bbb90e294256a" ON "won_team_match"`);
        await queryRunner.query(`DROP TABLE "won_team_match"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP INDEX "REL_b2cccee84bc219af212d659017" ON "team"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP INDEX "REL_f1a19958cb90f5ea3879678a20" ON "coach"`);
        await queryRunner.query(`DROP INDEX "REL_1f2795aa1fb31dd9444f96aa80" ON "coach"`);
        await queryRunner.query(`DROP TABLE "coach"`);
        await queryRunner.query(`DROP TABLE "sponsor"`);
        await queryRunner.query(`DROP TABLE "sport"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "tournament"`);
    }

}
