import { MigrationInterface, QueryRunner } from "typeorm";

export class FixingSessionEntity1721759960385 implements MigrationInterface {
    name = 'FixingSessionEntity1721759960385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "lastReplacedAt" datetime`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresIn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresIn"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "lastReplacedAt" datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`);
    }

}
