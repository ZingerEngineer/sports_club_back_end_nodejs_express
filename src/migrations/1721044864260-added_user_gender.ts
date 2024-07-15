import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserGender1721044864260 implements MigrationInterface {
    name = 'AddedUserGender1721044864260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" nvarchar(10) NOT NULL CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
    }

}
