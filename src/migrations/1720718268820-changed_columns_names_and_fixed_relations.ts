import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangedColumnsNamesAndFixedRelations1720718268820
  implements MigrationInterface
{
  name = 'ChangedColumnsNamesAndFixedRelations1720718268820'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_5e711f7b47b29cf65c10eb47cfa"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_9d2b6c364aa0b6fe81f25c9b87c"`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "FK_1f2795aa1fb31dd9444f96aa803"`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "FK_f1a19958cb90f5ea3879678a204"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_41027dbcf54d6d3fe158d6ab843"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_0724b86622f89c433dee4cd8b17"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_a1b5b4f5fa1b7f890d0a278748b"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_ea94596af0abda4d169c85d1864"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_4d3219adfdd12bfd95a16f7aa3b"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_295053f84d1fb2ef7a67d4ae9f8"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_7bc36e696b889a536cb0842ee83"`
    )
    await queryRunner.query(
      `ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_83001daa64957bbb90e294256a2"`
    )
    await queryRunner.query(
      `ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_c09422def5cdd67b83311a34dd4"`
    )
    await queryRunner.query(
      `DROP INDEX "REL_1f2795aa1fb31dd9444f96aa80" ON "coach"`
    )
    await queryRunner.query(
      `DROP INDEX "REL_f1a19958cb90f5ea3879678a20" ON "coach"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_ea94596af0abda4d169c85d186" ON "sponsored_teams"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_4d3219adfdd12bfd95a16f7aa3" ON "sponsored_teams"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_295053f84d1fb2ef7a67d4ae9f" ON "sponsored_tournaments"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_7bc36e696b889a536cb0842ee8" ON "sponsored_tournaments"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_83001daa64957bbb90e294256a" ON "won_team_match"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_c09422def5cdd67b83311a34dd" ON "lost_team_match"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.won_team_match.match_id", "matchId"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.won_team_match.PK_02b345775e8e88c830e779df2f7", "PK_694e1d34843f0329d9cf0a2f143"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.lost_team_match.match_id", "matchId"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.lost_team_match.PK_3b9a1f8872f14d998cf818c7317", "PK_63cf99999f860eecdee9a5dc00f"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" DROP CONSTRAINT "PK_2c853dd361a7c851f48f2f954b5"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" DROP CONSTRAINT "DF_e7275a819af5477f6a37e14e1b6"`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "sponsor_id"`)
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "brand_name"`)
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "sponsor" ADD  "temp" int`)
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "delete_date"`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "PK_232f6973497284cc8acb7bf5efa"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "tournament_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "tournament_name"`
    )
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "date_held"`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "DF_9e2ea14906fc900f6a83b7281c5"`
    )
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "tournament" ADD "temp" int`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "delete_date"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "PK_2e7d516f3dc97d9e2f882212d2b"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "match_id"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_7a1ffc439c724032b9b5f0b9f3f"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "match_type"`)
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "date_held"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_69b361844d37587ab8c5ba78b0c"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "match_duration"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_22a542498dfa76e38b506b73ee9"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "delete_date"`)
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "sport_id"`)
    await queryRunner.query(`ALTER TABLE "match" ADD  "temp" int`)
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "tournament_id"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP CONSTRAINT "PK_85896d8d20cf619732a5c1fd727"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "sport_id"`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "sport_name"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP COLUMN "sport_description"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "sport_rules"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP CONSTRAINT "DF_e29739e3bbfd72898a5db861a57"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "sport" ADD  "temp" int`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "delete_date"`)
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "PK_79a8206bc16eaf7ea2b4fc02749"`
    )
    await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "coach_id"`)
    await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "team_id"`)
    await queryRunner.query(
      `ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_a555138469f01b1405bca488377"`
    )
    await queryRunner.query(
      `ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_c7cc2ea6232e1c92fcae7ac1d09"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "team_id"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_ce5064461c0676068e2e102fdcb"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "team_name"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "team_type"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_9ab811e45e7ca7b8156ca3cbf57"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "below_age"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_6197a70c77370f4e23ca2b12485"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "matches_won"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_6691c2460c5d9d7bc8835a5d00c"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "matches_lost"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_536232a008de7a52034f46d5144"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "delete_date"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "temp" int`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "sport_id"`)
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "PK_9ee1ff741b18e49d7f7c71d2cc0"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP COLUMN "team_mem_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "DF_c060f5779f961c1e63701a6092c"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP COLUMN "match_role"`
    )
    await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "team_id"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_758b8ce7c18b9d347461b30228d"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_7a4fd2a547828e5efe420e50d1c"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_6937e802be2946855a3ad0e6bef"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_666851d8509be413462c3b150c0"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_deleted"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "delete_date"`)
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_a9948c5253f687775b0ef99087a"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_4d3219adfdd12bfd95a16f7aa3b" PRIMARY KEY ("team_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP COLUMN "sponsor_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_4d3219adfdd12bfd95a16f7aa3b"`
    )
    await queryRunner.query(`ALTER TABLE "sponsored_teams" ADD "temp" int`)
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP COLUMN "team_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_1bc07b0dc330af2a9791ae2a77d"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_7bc36e696b889a536cb0842ee83" PRIMARY KEY ("tournament_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP COLUMN "sponsor_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_7bc36e696b889a536cb0842ee83"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD "temp" int`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP COLUMN "tournament_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "sponsorId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "temp"`)

    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD CONSTRAINT "PK_d68d6fb65b3be0b3cb6c6455a9e" PRIMARY KEY ("sponsorId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "name" nvarchar(75) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_6ceee1c046f704685848860d358" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_21e6a0146eb1bf534397ce85009" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" ADD "deletedAt" datetime`)
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "tournamentId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "PK_fbec894d68c361a6aa2db4cfd4e" PRIMARY KEY ("tournamentId")`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "tournamentName" nvarchar(120) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_d78ae9845b857b23026182903b6" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "tournament" ADD "deletedAt" datetime`)
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "temp"`)
    await queryRunner.query(
      `ALTER TABLE "match" ADD "matchId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "PK_7dd6d1fec38b24c30d6907d51e2" PRIMARY KEY ("matchId")`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "type" nvarchar(50) NOT NULL CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6" DEFAULT 'scrimmage'`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "duration" time(3) NOT NULL CONSTRAINT "DF_a56345ceda48a8e8d72e0355239" DEFAULT '00:00:00.000'`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_204dbb46fd68aebb2723961e149" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "match" ADD "deletedAt" datetime`)
    await queryRunner.query(`ALTER TABLE "match" ADD "sportSportId" int`)
    await queryRunner.query(
      `ALTER TABLE "match" ADD "tournamentTournamentId" int`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "temp"`)
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "sportId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD CONSTRAINT "PK_b505287a27cba0f9ea6db4d2486" PRIMARY KEY ("sportId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "name" nvarchar(75) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "description" nvarchar(250) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "rules" nvarchar(400) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_d7cfb373a583973db931b1f5e61" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_9d57de807b8c3020a65d6a3b585" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "temp"`)
    await queryRunner.query(`ALTER TABLE "sport" ADD "deletedAt" datetime`)
    await queryRunner.query(
      `ALTER TABLE "coach" ADD "coachId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "PK_98a0f2bec36b724f8555091c7ed" PRIMARY KEY ("coachId")`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "teamId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "PK_e3c1e347fd4f0813cc7b2e2115b" PRIMARY KEY ("teamId")`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "teamName" nvarchar(35) NOT NULL CONSTRAINT "DF_0393bee845ac489bc68c1358fd8" DEFAULT 'Guest team'`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "teamType" nvarchar(20) NOT NULL CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73" DEFAULT 'candidates'`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "belowAge" int NOT NULL CONSTRAINT "DF_6d3c3968a17f8b9fdad85eff3d9" DEFAULT 15`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "matchesWon" int NOT NULL CONSTRAINT "DF_faa072b3155b37d01e6b142296d" DEFAULT 0`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "matchesLost" int NOT NULL CONSTRAINT "DF_3be950d89d8488018cb162f4a60" DEFAULT 0`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_2cc4c76495121fb016942523860" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_2ed3b07e5e46dc2e8d0ae6b2268" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "team" ADD "deletedAt" datetime`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "temp"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "sportSportId" int`)
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "teamMemberId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "PK_5797b661f7b69bf1e6de73dacae" PRIMARY KEY ("teamMemberId")`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "matchRole" nvarchar(100) NOT NULL CONSTRAINT "DF_1f5d46af10b9b8d5a63d0d0db42" DEFAULT 'Guest'`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "userUserId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "teamTeamId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userId" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" nvarchar(25) NOT NULL CONSTRAINT "DF_58e4dbff0e1a32a9bdc861bb29e" DEFAULT 'Guest'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" nvarchar(25) NOT NULL CONSTRAINT "DF_f0e1b4ecdca13b177e2e3a0613c" DEFAULT ''`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" datetime NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT GETDATE()`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isDeleted" int NOT NULL CONSTRAINT "DF_c95e384ff549a266b7dcba999db" DEFAULT 0`
    )
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" datetime`)
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD "sponsorId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_e44af25b1c35d26616017c35d29" PRIMARY KEY ("sponsorId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD "teamId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_e44af25b1c35d26616017c35d29"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_ef795600fa7074dc324e4bf9e26" PRIMARY KEY ("sponsorId", "teamId")`
    )

    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD "sponsorId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP COLUMN "temp"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_342058d891cd20983ab8abde38d" PRIMARY KEY ("sponsorId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD "tournamentId" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_342058d891cd20983ab8abde38d"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_ee19db1e45046678ec4406a8079" PRIMARY KEY ("sponsorId", "tournamentId")`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e44af25b1c35d26616017c35d2" ON "sponsored_teams" ("sponsorId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4b4b093483b8780379c6c1ceae" ON "sponsored_teams" ("teamId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_342058d891cd20983ab8abde38" ON "sponsored_tournaments" ("sponsorId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_26196c00142167beb1d2f0b7f2" ON "sponsored_tournaments" ("tournamentId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bbe33c871aed728d57b1bf2eba" ON "won_team_match" ("matchId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d81d341abc6f16cf333c47ea7c" ON "lost_team_match" ("matchId") `
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_f64073da09abc013b62256fb668" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf" FOREIGN KEY ("tournamentTournamentId") REFERENCES "tournament"("tournamentId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_3c43702f4fa9af7a917cd006829" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_7678387ec9659186501c236aabc" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6" FOREIGN KEY ("teamTeamId") REFERENCES "team"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_e44af25b1c35d26616017c35d29" FOREIGN KEY ("sponsorId") REFERENCES "sponsor"("sponsorId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_4b4b093483b8780379c6c1ceae3" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "sponsored_teams" DROP COLUMN "temp"`)
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_342058d891cd20983ab8abde38d" FOREIGN KEY ("sponsorId") REFERENCES "sponsor"("sponsorId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_26196c00142167beb1d2f0b7f24" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("tournamentId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "won_team_match" ADD CONSTRAINT "FK_bbe33c871aed728d57b1bf2eba3" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "lost_team_match" ADD CONSTRAINT "FK_d81d341abc6f16cf333c47ea7ce" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lost_team_match" DROP CONSTRAINT "FK_d81d341abc6f16cf333c47ea7ce"`
    )
    await queryRunner.query(
      `ALTER TABLE "won_team_match" DROP CONSTRAINT "FK_bbe33c871aed728d57b1bf2eba3"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_26196c00142167beb1d2f0b7f24"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "FK_342058d891cd20983ab8abde38d"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_4b4b093483b8780379c6c1ceae3"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "FK_e44af25b1c35d26616017c35d29"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_7678387ec9659186501c236aabc"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_3c43702f4fa9af7a917cd006829"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_f64073da09abc013b62256fb668"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_d81d341abc6f16cf333c47ea7c" ON "lost_team_match"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_bbe33c871aed728d57b1bf2eba" ON "won_team_match"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_26196c00142167beb1d2f0b7f2" ON "sponsored_tournaments"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_342058d891cd20983ab8abde38" ON "sponsored_tournaments"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_4b4b093483b8780379c6c1ceae" ON "sponsored_teams"`
    )
    await queryRunner.query(
      `DROP INDEX "IDX_e44af25b1c35d26616017c35d2" ON "sponsored_teams"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_ee19db1e45046678ec4406a8079"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_342058d891cd20983ab8abde38d" PRIMARY KEY ("sponsorId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP COLUMN "tournamentId"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_342058d891cd20983ab8abde38d"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP COLUMN "sponsorId"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_ef795600fa7074dc324e4bf9e26"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_e44af25b1c35d26616017c35d29" PRIMARY KEY ("sponsorId")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP COLUMN "teamId"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_e44af25b1c35d26616017c35d29"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP COLUMN "sponsorId"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_c95e384ff549a266b7dcba999db"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_e11e649824a45d8ed01d597fd93"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_f0e1b4ecdca13b177e2e3a0613c"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_58e4dbff0e1a32a9bdc861bb29e"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_d72ea127f30e21753c9e229891e"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`)
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP COLUMN "teamTeamId"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP COLUMN "userUserId"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "DF_1f5d46af10b9b8d5a63d0d0db42"`
    )
    await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "matchRole"`)
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "PK_5797b661f7b69bf1e6de73dacae"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP COLUMN "teamMemberId"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "sportSportId"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_2ed3b07e5e46dc2e8d0ae6b2268"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_2cc4c76495121fb016942523860"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_3be950d89d8488018cb162f4a60"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "matchesLost"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_faa072b3155b37d01e6b142296d"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "matchesWon"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_6d3c3968a17f8b9fdad85eff3d9"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "belowAge"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "teamType"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "DF_0393bee845ac489bc68c1358fd8"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "teamName"`)
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "PK_e3c1e347fd4f0813cc7b2e2115b"`
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "teamId"`)
    await queryRunner.query(
      `ALTER TABLE "coach" DROP CONSTRAINT "PK_98a0f2bec36b724f8555091c7ed"`
    )
    await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "coachId"`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP CONSTRAINT "DF_9d57de807b8c3020a65d6a3b585"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP CONSTRAINT "DF_d7cfb373a583973db931b1f5e61"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "rules"`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "description"`)
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "sport" DROP CONSTRAINT "PK_b505287a27cba0f9ea6db4d2486"`
    )
    await queryRunner.query(`ALTER TABLE "sport" DROP COLUMN "sportId"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP COLUMN "tournamentTournamentId"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "sportSportId"`)
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_204dbb46fd68aebb2723961e149"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_a56345ceda48a8e8d72e0355239"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "duration"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "type"`)
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "PK_7dd6d1fec38b24c30d6907d51e2"`
    )
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "matchId"`)
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "DF_d78ae9845b857b23026182903b6"`
    )
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da"`
    )
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "tournamentName"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "PK_fbec894d68c361a6aa2db4cfd4e"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "tournamentId"`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "sponsor" DROP CONSTRAINT "DF_21e6a0146eb1bf534397ce85009"`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "isDeleted"`)
    await queryRunner.query(
      `ALTER TABLE "sponsor" DROP CONSTRAINT "DF_6ceee1c046f704685848860d358"`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "sponsor" DROP CONSTRAINT "PK_d68d6fb65b3be0b3cb6c6455a9e"`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" DROP COLUMN "sponsorId"`)
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD "tournament_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_7bc36e696b889a536cb0842ee83" PRIMARY KEY ("tournament_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD "sponsor_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" DROP CONSTRAINT "PK_7bc36e696b889a536cb0842ee83"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "PK_1bc07b0dc330af2a9791ae2a77d" PRIMARY KEY ("sponsor_id", "tournament_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD "team_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_4d3219adfdd12bfd95a16f7aa3b" PRIMARY KEY ("team_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD "sponsor_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" DROP CONSTRAINT "PK_4d3219adfdd12bfd95a16f7aa3b"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "PK_a9948c5253f687775b0ef99087a" PRIMARY KEY ("sponsor_id", "team_id")`
    )
    await queryRunner.query(`ALTER TABLE "user" ADD "delete_date" datetime`)
    await queryRunner.query(`ALTER TABLE "user" ADD "is_deleted" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_666851d8509be413462c3b150c0" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_name" nvarchar(25) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_6937e802be2946855a3ad0e6bef" DEFAULT '' FOR "last_name"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_name" nvarchar(25) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_7a4fd2a547828e5efe420e50d1c" DEFAULT 'Guest' FOR "first_name"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "user_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "team_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "user_id" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "match_role" nvarchar(100) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "DF_c060f5779f961c1e63701a6092c" DEFAULT 'Guest' FOR "match_role"`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD "team_mem_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "PK_9ee1ff741b18e49d7f7c71d2cc0" PRIMARY KEY ("team_mem_id")`
    )
    await queryRunner.query(`ALTER TABLE "team" ADD "sport_id" int`)
    await queryRunner.query(`ALTER TABLE "team" ADD "delete_date" datetime`)
    await queryRunner.query(`ALTER TABLE "team" ADD "is_deleted" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_536232a008de7a52034f46d5144" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "matches_lost" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_6691c2460c5d9d7bc8835a5d00c" DEFAULT 0 FOR "matches_lost"`
    )
    await queryRunner.query(`ALTER TABLE "team" ADD "matches_won" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_6197a70c77370f4e23ca2b12485" DEFAULT 0 FOR "matches_won"`
    )
    await queryRunner.query(`ALTER TABLE "team" ADD "below_age" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_9ab811e45e7ca7b8156ca3cbf57" DEFAULT 15 FOR "below_age"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "team_type" nvarchar(20) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_0026a25610d4e56b8cd5fcab822" DEFAULT 'candidates' FOR "team_type"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "team_name" nvarchar(35) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "DF_ce5064461c0676068e2e102fdcb" DEFAULT 'Guest team' FOR "team_name"`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD "team_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id")`
    )
    await queryRunner.query(`ALTER TABLE "coach" ADD "team_id" int NOT NULL`)
    await queryRunner.query(`ALTER TABLE "coach" ADD "user_id" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "coach" ADD "coach_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "PK_79a8206bc16eaf7ea2b4fc02749" PRIMARY KEY ("coach_id")`
    )
    await queryRunner.query(`ALTER TABLE "sport" ADD "delete_date" datetime`)
    await queryRunner.query(`ALTER TABLE "sport" ADD "is_deleted" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "sport" ADD CONSTRAINT "DF_e29739e3bbfd72898a5db861a57" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "sport_rules" nvarchar(400) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "sport_description" nvarchar(250) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "sport_name" nvarchar(75) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD "sport_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "sport" ADD CONSTRAINT "PK_85896d8d20cf619732a5c1fd727" PRIMARY KEY ("sport_id")`
    )
    await queryRunner.query(`ALTER TABLE "match" ADD "tournament_id" int`)
    await queryRunner.query(`ALTER TABLE "match" ADD "sport_id" int NOT NULL`)
    await queryRunner.query(`ALTER TABLE "match" ADD "delete_date" datetime`)
    await queryRunner.query(`ALTER TABLE "match" ADD "is_deleted" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "DF_22a542498dfa76e38b506b73ee9" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "match_duration" time(3) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "DF_69b361844d37587ab8c5ba78b0c" DEFAULT '00:00:00.000' FOR "match_duration"`
    )
    await queryRunner.query(`ALTER TABLE "match" ADD "date_held" date NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "match" ADD "match_type" nvarchar(50) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "DF_7a1ffc439c724032b9b5f0b9f3f" DEFAULT 'scrimmage' FOR "match_type"`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD "match_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "PK_2e7d516f3dc97d9e2f882212d2b" PRIMARY KEY ("match_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "delete_date" datetime`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "is_deleted" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "DF_9e2ea14906fc900f6a83b7281c5" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "date_held" datetime NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "tournament_name" nvarchar(120) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "tournament_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "PK_232f6973497284cc8acb7bf5efa" PRIMARY KEY ("tournament_id")`
    )
    await queryRunner.query(`ALTER TABLE "sponsor" ADD "delete_date" datetime`)
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "is_deleted" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD CONSTRAINT "DF_e7275a819af5477f6a37e14e1b6" DEFAULT 0 FOR "is_deleted"`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "brand_name" nvarchar(75) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD "sponsor_id" int NOT NULL IDENTITY(1,1)`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsor" ADD CONSTRAINT "PK_2c853dd361a7c851f48f2f954b5" PRIMARY KEY ("sponsor_id")`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.lost_team_match.PK_63cf99999f860eecdee9a5dc00f", "PK_3b9a1f8872f14d998cf818c7317"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.lost_team_match.matchId", "match_id"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.won_team_match.PK_694e1d34843f0329d9cf0a2f143", "PK_02b345775e8e88c830e779df2f7"`
    )
    await queryRunner.query(
      `EXEC sp_rename "sports_club.dbo.won_team_match.matchId", "match_id"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c09422def5cdd67b83311a34dd" ON "lost_team_match" ("match_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_83001daa64957bbb90e294256a" ON "won_team_match" ("match_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7bc36e696b889a536cb0842ee8" ON "sponsored_tournaments" ("tournament_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_295053f84d1fb2ef7a67d4ae9f" ON "sponsored_tournaments" ("sponsor_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4d3219adfdd12bfd95a16f7aa3" ON "sponsored_teams" ("team_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ea94596af0abda4d169c85d186" ON "sponsored_teams" ("sponsor_id") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_f1a19958cb90f5ea3879678a20" ON "coach" ("team_id") WHERE ([team_id] IS NOT NULL)`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_1f2795aa1fb31dd9444f96aa80" ON "coach" ("user_id") WHERE ([user_id] IS NOT NULL)`
    )
    await queryRunner.query(
      `ALTER TABLE "lost_team_match" ADD CONSTRAINT "FK_c09422def5cdd67b83311a34dd4" FOREIGN KEY ("match_id") REFERENCES "match"("match_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "won_team_match" ADD CONSTRAINT "FK_83001daa64957bbb90e294256a2" FOREIGN KEY ("match_id") REFERENCES "match"("match_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_7bc36e696b889a536cb0842ee83" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("tournament_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_tournaments" ADD CONSTRAINT "FK_295053f84d1fb2ef7a67d4ae9f8" FOREIGN KEY ("sponsor_id") REFERENCES "sponsor"("sponsor_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_4d3219adfdd12bfd95a16f7aa3b" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sponsored_teams" ADD CONSTRAINT "FK_ea94596af0abda4d169c85d1864" FOREIGN KEY ("sponsor_id") REFERENCES "sponsor"("sponsor_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_a1b5b4f5fa1b7f890d0a278748b" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_0724b86622f89c433dee4cd8b17" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_41027dbcf54d6d3fe158d6ab843" FOREIGN KEY ("sport_id") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "FK_f1a19958cb90f5ea3879678a204" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "FK_1f2795aa1fb31dd9444f96aa803" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_9d2b6c364aa0b6fe81f25c9b87c" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("tournament_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_5e711f7b47b29cf65c10eb47cfa" FOREIGN KEY ("sport_id") REFERENCES "sport"("sport_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}

