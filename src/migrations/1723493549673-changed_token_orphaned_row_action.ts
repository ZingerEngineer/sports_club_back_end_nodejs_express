import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedTokenOrphanedRowAction1723493549673 implements MigrationInterface {
    name = 'ChangedTokenOrphanedRowAction1723493549673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
    }

}
