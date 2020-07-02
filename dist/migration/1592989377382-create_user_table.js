"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTable1592989377382 = void 0;
class createUserTable1592989377382 {
    constructor() {
        this.name = 'createUserTable1592989377382';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "age" integer NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.createUserTable1592989377382 = createUserTable1592989377382;
