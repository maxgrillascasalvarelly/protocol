import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

const metaTransactionV2SubmissionsTable = new Table({
    name: 'meta_transaction_v2_submissions',
    columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
        { name: 'transaction_hash', type: 'varchar' },
        { name: 'meta_transaction_v2_job_id', type: 'uuid' },
        { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamptz', isNullable: true },
        { name: 'from', type: 'varchar' },
        { name: 'to', type: 'varchar' },
        { name: 'nonce', type: 'bigint' },
        { name: 'gas_price', type: 'numeric', isNullable: true },
        { name: 'max_fee_per_gas', type: 'numeric', isNullable: true },
        { name: 'max_priority_fee_per_gas', type: 'numeric', isNullable: true },
        { name: 'gas_used', type: 'numeric', isNullable: true },
        { name: 'block_mined', type: 'numeric', isNullable: true },
        { name: 'status', type: 'varchar' },
        { name: 'type', type: 'varchar' },
    ],
});

const transactionHashIndex = new TableIndex({
    name: `meta_transaction_v2_submissions_transaction_hash_index`,
    columnNames: ['transaction_hash'],
});
const metaTransactionJobIdIndex = new TableIndex({
    name: `meta_transaction_v2_submissions_meta_transaction_v2_job_id_index`,
    columnNames: ['meta_transaction_v2_job_id'],
});
const createdAtIndex = new TableIndex({
    name: `meta_transaction_v2_submissions_created_at_index`,
    columnNames: ['created_at'],
});
const statusIndex = new TableIndex({ name: `meta_transaction_v2_submissions_status_index`, columnNames: ['status'] });

const foreignKey = new TableForeignKey({
    name: 'meta_transaction_v2_submissions_meta_transaction_v2_job_id_foreign_key',
    columnNames: ['meta_transaction_v2_job_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'meta_transaction_v2_jobs',
    onDelete: 'RESTRICT',
});

export class CreateMetaTransactionV2SubmissionsTable1678685941817 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`); // for `uuid_generate_v4`
        await queryRunner.createTable(metaTransactionV2SubmissionsTable);
        await queryRunner.createIndex(metaTransactionV2SubmissionsTable, transactionHashIndex);
        await queryRunner.createIndex(metaTransactionV2SubmissionsTable, metaTransactionJobIdIndex);
        await queryRunner.createIndex(metaTransactionV2SubmissionsTable, createdAtIndex);
        await queryRunner.createIndex(metaTransactionV2SubmissionsTable, statusIndex);
        await queryRunner.createForeignKey(metaTransactionV2SubmissionsTable, foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(metaTransactionV2SubmissionsTable, foreignKey);
        await queryRunner.dropIndex(metaTransactionV2SubmissionsTable, transactionHashIndex);
        await queryRunner.dropIndex(metaTransactionV2SubmissionsTable, metaTransactionJobIdIndex);
        await queryRunner.dropIndex(metaTransactionV2SubmissionsTable, createdAtIndex);
        await queryRunner.dropIndex(metaTransactionV2SubmissionsTable, statusIndex);
        await queryRunner.dropTable(metaTransactionV2SubmissionsTable);
    }
}