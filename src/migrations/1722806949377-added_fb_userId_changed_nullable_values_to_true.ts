import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedFbUserIdChangedNullableValuesToTrue1722806949377
  implements MigrationInterface
{
  name = 'AddedFbUserIdChangedNullableValuesToTrue1722806949377'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userFaceBookId" nvarchar(MAX)`
    )
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT DATEADD(MINUTE,60,GETUTCDATE()) FOR "expiresAt"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userGoogleId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userGoogleId" nvarchar(MAX)`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emailVerifiedAt" datetime`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" varchar(40)`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" varchar(40)`
    )
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" int`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a"`
    )
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dob" date`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_997a25036ba355bdad2d22cb29b"`
    )
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "age" int`)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_1f457efff42e9e3d54598c4bd8f"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_1f457efff42e9e3d54598c4bd8f" DEFAULT 0 FOR "age"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "age" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_997a25036ba355bdad2d22cb29b" DEFAULT '' FOR "dob"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "dob" date NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_a0f3f1de3c7590ddf4299b6596a" DEFAULT 0 FOR "gender"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "gender" int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" varchar(40) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" varchar(40) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emailVerifiedAt" datetime`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userGoogleId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userGoogleId" nvarchar(100)`
    )
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "DF_1e501032760da917c7c9398eb03"`
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "DF_1e501032760da917c7c9398eb03" DEFAULT dateadd(minute,(60),getutcdate()) FOR "expiresAt"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userFaceBookId"`)
  }
}

