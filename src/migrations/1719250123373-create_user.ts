import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1719250123373 implements MigrationInterface {
    name = 'CreateUser1719250123373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("user_id" int NOT NULL IDENTITY(1,1), "role" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "team" int NOT NULL, "dob" datetime NOT NULL, "job" nvarchar(255) NOT NULL, "reports_from" int NOT NULL, "reported_on" int NOT NULL, "isDeleted" bit NOT NULL, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
