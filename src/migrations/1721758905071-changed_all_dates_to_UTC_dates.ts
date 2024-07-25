import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedAllDatesToUTCDates1721758905071 implements MigrationInterface {
    name = 'ChangedAllDatesToUTCDates1721758905071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport" DROP CONSTRAINT "DF_d7cfb373a583973db931b1f5e61"`);
        await queryRunner.query(`ALTER TABLE "sport" ADD CONSTRAINT "DF_d7cfb373a583973db931b1f5e61" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sponsor" DROP CONSTRAINT "DF_6ceee1c046f704685848860d358"`);
        await queryRunner.query(`ALTER TABLE "sponsor" ADD CONSTRAINT "DF_6ceee1c046f704685848860d358" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_1063954fd0fa5e655cc482fb5c7"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_1063954fd0fa5e655cc482fb5c7" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_68da7c33481f24fc1b730e48415"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresIn"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expiresIn" datetime NOT NULL CONSTRAINT "DF_82ee70803f899565d260cfbd86a" DEFAULT DATEADD(MINUTE,60,GETUTCDATE())`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_b359a8a84f7a301f66bc0b3c083" DEFAULT '' FOR "tokenBody"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_929f7d7caa0b6a61df7735a2671"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_929f7d7caa0b6a61df7735a2671" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_e11e649824a45d8ed01d597fd93"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "DF_2cc4c76495121fb016942523860"`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "DF_2cc4c76495121fb016942523860" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3" DEFAULT GETUTCDATE() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da" DEFAULT GETUTCDATE() FOR "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "DF_09ef19d3c8210acb6cc486b19da" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "DF_34abd2a54e1d97354d44dd004e3" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "DF_2cc4c76495121fb016942523860"`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "DF_2cc4c76495121fb016942523860" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_e11e649824a45d8ed01d597fd93"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_929f7d7caa0b6a61df7735a2671"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "DF_929f7d7caa0b6a61df7735a2671" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_b359a8a84f7a301f66bc0b3c083"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "DF_82ee70803f899565d260cfbd86a"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresIn"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expiresIn" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_68da7c33481f24fc1b730e48415" DEFAULT '' FOR "lastReplacedAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_1063954fd0fa5e655cc482fb5c7"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_1063954fd0fa5e655cc482fb5c7" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8"`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "DF_5d97cf9773002b16861b4bb8ae8" DEFAULT getdate()+(1) FOR "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "sponsor" DROP CONSTRAINT "DF_6ceee1c046f704685848860d358"`);
        await queryRunner.query(`ALTER TABLE "sponsor" ADD CONSTRAINT "DF_6ceee1c046f704685848860d358" DEFAULT getdate() FOR "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sport" DROP CONSTRAINT "DF_d7cfb373a583973db931b1f5e61"`);
        await queryRunner.query(`ALTER TABLE "sport" ADD CONSTRAINT "DF_d7cfb373a583973db931b1f5e61" DEFAULT getdate() FOR "createdAt"`);
    }

}
