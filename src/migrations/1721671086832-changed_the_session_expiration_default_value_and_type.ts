import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedTheSessionExpirationDefaultValueAndType1721671086832 implements MigrationInterface {
    name = 'ChangedTheSessionExpirationDefaultValueAndType1721671086832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expiresAt" datetime NOT NULL CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT GETDATE() + 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expiresAt" timestamp NOT NULL`);
    }

}
