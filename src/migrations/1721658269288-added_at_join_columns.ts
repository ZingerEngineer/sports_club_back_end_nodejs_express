import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAtJoinColumns1721658269288 implements MigrationInterface {
    name = 'AddedAtJoinColumns1721658269288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_7678387ec9659186501c236aabc"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_3c43702f4fa9af7a917cd006829"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_f64073da09abc013b62256fb668"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf"`);
        await queryRunner.query(`EXEC sp_rename "sports_club.dbo.team.sportSportId", "sportId"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "teamTeamId"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "sportSportId"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "tournamentTournamentId"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "userId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "teamId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "sportId" int`);
        await queryRunner.query(`ALTER TABLE "match" ADD "tournamentId" int`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_d2be3e8fc9ab0f69673721c7fc3" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_7f0ff226a6b0fd12c02991f801e" FOREIGN KEY ("sportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_39404e61badc2185d608881f5fb" FOREIGN KEY ("sportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_b096f0c0ca94610b3e77128500c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("tournamentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_b096f0c0ca94610b3e77128500c"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_39404e61badc2185d608881f5fb"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_7f0ff226a6b0fd12c02991f801e"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_d2be3e8fc9ab0f69673721c7fc3"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "tournamentId"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "sportId"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "tournamentTournamentId" int`);
        await queryRunner.query(`ALTER TABLE "match" ADD "sportSportId" int`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "teamTeamId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "userUserId" int NOT NULL`);
        await queryRunner.query(`EXEC sp_rename "sports_club.dbo.team.sportId", "sportSportId"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_216d7823d83d7c038552dbb3aaf" FOREIGN KEY ("tournamentTournamentId") REFERENCES "tournament"("tournamentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_f64073da09abc013b62256fb668" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_3c43702f4fa9af7a917cd006829" FOREIGN KEY ("sportSportId") REFERENCES "sport"("sportId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_b13397bccd29fe3ffaaae10a7e6" FOREIGN KEY ("teamTeamId") REFERENCES "team"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_7678387ec9659186501c236aabc" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
