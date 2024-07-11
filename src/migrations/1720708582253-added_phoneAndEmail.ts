import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPhoneAndEmail1720708582253 implements MigrationInterface {
    name = 'AddedPhoneAndEmail1720708582253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" varchar(15) NOT NULL CONSTRAINT "DF_8e1f623798118e629b46a9e6299" DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" varchar(40) NOT NULL CONSTRAINT "DF_e12875dfb3b1d92d7d7c5377e22" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_8e1f623798118e629b46a9e6299"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
