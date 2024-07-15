import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDefaultPropertyForDataColumn1721058465757 implements MigrationInterface {
    name = 'AddedDefaultPropertyForDataColumn1721058465757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_9a3373fd9582e2897f292321489" DEFAULT '' FOR "data"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_9a3373fd9582e2897f292321489"`);
    }

}
