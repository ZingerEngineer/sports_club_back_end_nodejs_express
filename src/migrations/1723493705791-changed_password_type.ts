import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedPasswordType1723493705791 implements MigrationInterface {
    name = 'ChangedPasswordType1723493705791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" nvarchar(MAX)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" varchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
    }

}
