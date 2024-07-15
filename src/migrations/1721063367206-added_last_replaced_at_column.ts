import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLastReplacedAtColumn1721063367206 implements MigrationInterface {
    name = 'AddedLastReplacedAtColumn1721063367206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "lastReplacedAt" datetime NOT NULL CONSTRAINT "DF_68da7c33481f24fc1b730e48415" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_68da7c33481f24fc1b730e48415"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "lastReplacedAt"`);
    }

}
