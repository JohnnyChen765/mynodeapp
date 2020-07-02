import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserTable1592989377382 implements MigrationInterface {
    name = 'createUserTable1592989377382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "age" integer NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
