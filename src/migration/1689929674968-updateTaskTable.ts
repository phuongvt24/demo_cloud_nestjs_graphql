import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskTable1689929674968 implements MigrationInterface {
    name = 'UpdateTaskTable1689929674968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`priority\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`priority\` enum ('Low', 'Medium', 'High') NOT NULL DEFAULT 'High'`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`status\` enum ('Done', 'Pending', 'Doing') NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`priority\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`priority\` varchar(255) NOT NULL`);
    }

}
