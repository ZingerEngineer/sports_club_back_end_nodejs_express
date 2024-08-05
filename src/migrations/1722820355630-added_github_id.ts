import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedGithubId1722820355630 implements MigrationInterface {
    name = 'AddedGithubId1722820355630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userGitHubId" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userGitHubId"`);
    }

}
