import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserTokens1721404537601 implements MigrationInterface {
    name = 'AddedUserTokens1721404537601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("tokenId" varchar(255) NOT NULL, "expiresIn" varchar(255) NOT NULL, "tokenBody" nvarchar(MAX) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_929f7d7caa0b6a61df7735a2671" DEFAULT GETDATE(), "tokenType" varchar(255) NOT NULL CONSTRAINT "DF_b22d7ed34c828fb057ef2aa73a2" DEFAULT 0, "tokenUseTimes" int NOT NULL CONSTRAINT "DF_3c1c40658f73f55b3363467dfdd" DEFAULT 1, "userId" int, CONSTRAINT "PK_bb402e674ae9363a98e291ac2b7" PRIMARY KEY ("tokenId"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
