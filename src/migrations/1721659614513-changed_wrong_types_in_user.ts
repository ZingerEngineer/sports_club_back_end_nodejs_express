import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedWrongTypesInUser1721659614513 implements MigrationInterface {
    name = 'ChangedWrongTypesInUser1721659614513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" int NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_8e1f623798118e629b46a9e6299"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" nvarchar(15) NOT NULL CONSTRAINT "DF_8e1f623798118e629b46a9e6299" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_8e1f623798118e629b46a9e6299"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" varchar(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_8e1f623798118e629b46a9e6299" DEFAULT '' FOR "phone"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" nvarchar(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 1 FOR "role"`);
    }

}
