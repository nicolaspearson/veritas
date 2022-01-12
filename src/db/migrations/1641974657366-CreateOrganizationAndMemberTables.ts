import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationAndMemberTables1641974657366 implements MigrationInterface {
  name = 'CreateOrganizationAndMemberTables1641974657366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ORGANIZATION_NAME" ON "organization" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION_ID" ON "member" ("organization_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_MEMBER_USER_ID" ON "member" ("user_id") `);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_bfadaaab56ae7b5f2d76885d03b" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_efc766611e939bdbe6f7088984d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_efc766611e939bdbe6f7088984d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_bfadaaab56ae7b5f2d76885d03b"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`DROP INDEX "veritas"."IDX_MEMBER_USER_ID"`);
    await queryRunner.query(`DROP INDEX "veritas"."IDX_MEMBER_ORGANIZATION_ID"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP INDEX "veritas"."IDX_ORGANIZATION_NAME"`);
    await queryRunner.query(`DROP TABLE "organization"`);
  }
}
