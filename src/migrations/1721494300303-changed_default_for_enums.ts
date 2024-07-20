import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedDefaultForEnums1721494300303 implements MigrationInterface {
    name = 'ChangedDefaultForEnums1721494300303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "type" int NOT NULL CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "teamType"`);
        await queryRunner.query(`ALTER TABLE "team" ADD "teamType" int NOT NULL CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenType"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "tokenType" int NOT NULL CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 1 FOR "role"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" int NOT NULL CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_a18f709c808e3bde52a89885006"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "job"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "job" int NOT NULL CONSTRAINT "DF_a18f709c808e3bde52a89885006" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_a18f709c808e3bde52a89885006"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "job"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "job" nvarchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_a18f709c808e3bde52a89885006" DEFAULT 'guest' FOR "job"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" nvarchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a" DEFAULT '' FOR "gender"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 'user' FOR "role"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "tokenType"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "tokenType" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2" DEFAULT 0 FOR "tokenType"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "teamType"`);
        await queryRunner.query(`ALTER TABLE "team" ADD "teamType" nvarchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "DF_3e0e69e93a76e82d957f8f5fb73" DEFAULT 'candidates' FOR "teamType"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "type" nvarchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "DF_4c90e9976d9356c8d4ec5013ff6" DEFAULT 'scrimmage' FOR "type"`);
    }

}
