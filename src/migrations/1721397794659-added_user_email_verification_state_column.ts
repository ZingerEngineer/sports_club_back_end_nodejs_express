import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserEmailVerificationStateColumn1721397794659 implements MigrationInterface {
    name = 'AddedUserEmailVerificationStateColumn1721397794659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerified" int NOT NULL CONSTRAINT "DF_8599dd74e4af41f9e04a8348e75" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_8599dd74e4af41f9e04a8348e75"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
    }

}
