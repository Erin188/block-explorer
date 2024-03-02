import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBatchRootEventLogs1709380858531 implements MigrationInterface {
  name = "AddBatchRootEventLogs1709380858531";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "batches" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "rootHash" bytea, "timestamp" TIMESTAMP NOT NULL, "l1GasPrice" character varying(128) NOT NULL, "l2FairGasPrice" character varying(128) NOT NULL, "commitTxHash" bytea, "committedAt" TIMESTAMP, "proveTxHash" bytea, "provenAt" TIMESTAMP, "executeTxHash" bytea, "executedAt" TIMESTAMP, "l1TxCount" integer NOT NULL, "l2TxCount" integer NOT NULL, CONSTRAINT "UQ_4b496810fff6ce2504f6f7a5125" UNIQUE ("rootHash"), CONSTRAINT "PK_0d306b67f972c0ebb4a1fdcaf63" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4b496810fff6ce2504f6f7a512" ON "batches" ("rootHash") `);
    await queryRunner.query(`CREATE INDEX "IDX_01dcdc0d294fbdffb0460c6c47" ON "batches" ("committedAt") `);
    await queryRunner.query(`CREATE INDEX "IDX_2e5848205f50af3d87131715e9" ON "batches" ("provenAt") `);
    await queryRunner.query(`CREATE INDEX "IDX_468b5ed00f6d47b1552970b2bb" ON "batches" ("timestamp", "number") `);
    await queryRunner.query(`CREATE INDEX "IDX_e509df4634e707a7e96f65c081" ON "batches" ("executedAt", "number") `);
    await queryRunner.query(
      `CREATE TABLE "blocks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "hash" bytea NOT NULL, "parentHash" bytea, "timestamp" TIMESTAMP NOT NULL, "nonce" character varying NOT NULL, "difficulty" integer NOT NULL, "_difficulty" character varying(128) NOT NULL, "gasLimit" character varying(128) NOT NULL, "gasUsed" character varying(128) NOT NULL, "baseFeePerGas" character varying(128) NOT NULL, "miner" bytea NOT NULL, "extraData" bytea NOT NULL, "l1BatchNumber" bigint NOT NULL, "l1TxCount" integer NOT NULL, "l2TxCount" integer NOT NULL, CONSTRAINT "UQ_00d4f3eb491f00ae5bece2a559e" UNIQUE ("hash"), CONSTRAINT "PK_5c0b8f5cedabb33e58a625f8a7e" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_00d4f3eb491f00ae5bece2a559" ON "blocks" ("hash") `);
    await queryRunner.query(`CREATE INDEX "IDX_6b08048b61bf9f4c139336a3b5" ON "blocks" ("l1BatchNumber") `);
    await queryRunner.query(`CREATE INDEX "IDX_1ccfbf9a34c2be286db278de8c" ON "blocks" ("miner", "number") `);
    await queryRunner.query(`CREATE INDEX "IDX_3f6b380e545dcfc23494af6196" ON "blocks" ("timestamp", "number") `);
    await queryRunner.query(
      `CREATE TABLE "transactions" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hash" bytea NOT NULL, "number" BIGSERIAL NOT NULL, "to" bytea NOT NULL, "from" bytea NOT NULL, "nonce" bigint NOT NULL, "transactionIndex" integer NOT NULL, "gasLimit" character varying(128) NOT NULL, "gasPrice" character varying(128) NOT NULL, "maxFeePerGas" character varying(128), "maxPriorityFeePerGas" character varying(128), "data" bytea NOT NULL, "value" character varying(128) NOT NULL, "chainId" integer NOT NULL, "blockNumber" bigint NOT NULL, "blockHash" bytea NOT NULL, "type" integer NOT NULL, "accessList" jsonb, "l1BatchNumber" bigint NOT NULL, "fee" character varying NOT NULL, "gasPerPubdata" character varying, "isL1Originated" boolean NOT NULL, "receivedAt" TIMESTAMP NOT NULL, "receiptStatus" integer NOT NULL DEFAULT '1', "error" character varying, "revertReason" character varying, CONSTRAINT "PK_6f30cde2f4cf5a630e053758400" PRIMARY KEY ("hash"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_23368dc6dbdbe92f83c8bb1fd8" ON "transactions" ("number") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_33d33b468baadbec2f94ce52d2" ON "transactions" ("from", "isL1Originated", "l1BatchNumber", "nonce") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea74bf1e592f259b3e64884eb7" ON "transactions" ("blockNumber", "receivedAt", "transactionIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c41a3520808b2c207d4343aa46" ON "transactions" ("l1BatchNumber", "receivedAt", "transactionIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ea59f03238929aef98674f87d" ON "transactions" ("receivedAt", "transactionIndex") `
    );
    await queryRunner.query(
      `CREATE TABLE "tokens" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "l2Address" bytea NOT NULL, "l1Address" bytea, "networkKey" character varying NOT NULL, "number" BIGSERIAL NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "decimals" integer NOT NULL, "blockNumber" bigint NOT NULL, "transactionHash" bytea NOT NULL, "logIndex" integer NOT NULL, "usdPrice" double precision, "liquidity" double precision, "iconURL" character varying, "offChainDataUpdatedAt" TIMESTAMP, CONSTRAINT "CHK_6a3b312a8c9c24b217fe84ce0c" CHECK ("symbol" <> ''), CONSTRAINT "PK_44561e4a980180b869ae1233274" PRIMARY KEY ("l2Address"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_eab106a9418a761805c415fdeb" ON "tokens" ("l1Address") `);
    await queryRunner.query(`CREATE INDEX "IDX_32d1fee33194687356298e56b8" ON "tokens" ("transactionHash") `);
    await queryRunner.query(`CREATE INDEX "IDX_f9d4a596adf95ca64ed98810fd" ON "tokens" ("offChainDataUpdatedAt") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_c45d488f03a4724a1b8490068c" ON "tokens" ("liquidity", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transfers_type_enum" AS ENUM('deposit', 'transfer', 'withdrawal', 'fee', 'mint', 'refund')`
    );
    await queryRunner.query(`CREATE TYPE "public"."transfers_tokentype_enum" AS ENUM('ETH', 'ERC20', 'ERC721')`);
    await queryRunner.query(
      `CREATE TABLE "transfers" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "from" bytea NOT NULL, "to" bytea NOT NULL, "blockNumber" bigint NOT NULL, "transactionHash" bytea, "timestamp" TIMESTAMP NOT NULL, "transactionIndex" integer NOT NULL, "amount" character varying(128), "tokenAddress" bytea, "gateway" bytea, "type" "public"."transfers_type_enum" NOT NULL DEFAULT 'transfer', "tokenType" "public"."transfers_tokentype_enum" NOT NULL DEFAULT 'ETH', "isFeeOrRefund" boolean NOT NULL, "fields" jsonb, "logIndex" integer NOT NULL, "isInternal" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_552edbef9f4e89a2331a6aae09b" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_730b817608cd0ed733d5b54837" ON "transfers" ("blockNumber") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6b29485268b54ac40f41e8bb49" ON "transfers" ("isInternal", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_22c850c7584a8727b44eb4decf" ON "transfers" ("transactionHash", "isInternal", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81191c296b89f6e7bbe819b995" ON "transfers" ("tokenAddress", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a870be7457f3f683510a83a66b" ON "transfers" ("tokenAddress", "isFeeOrRefund", "timestamp", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e9e7b97000e369771bfe87351" ON "transfers" ("transactionHash", "timestamp", "logIndex") `
    );
    await queryRunner.query(
      `CREATE TABLE "transactionReceipts" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionHash" bytea NOT NULL, "number" BIGSERIAL NOT NULL, "to" bytea NOT NULL, "from" bytea NOT NULL, "contractAddress" bytea, "transactionIndex" integer NOT NULL, "type" integer NOT NULL, "root" bytea NOT NULL, "gasUsed" character varying(128) NOT NULL, "effectiveGasPrice" character varying(128) NOT NULL, "logsBloom" bytea NOT NULL, "blockHash" bytea NOT NULL, "blockNumber" bigint NOT NULL, "cumulativeGasUsed" character varying(128) NOT NULL, "byzantium" boolean NOT NULL, "status" integer NOT NULL, CONSTRAINT "PK_1236ec3b6419b8e843af9807a07" PRIMARY KEY ("transactionHash"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d79410e38050a25a02ea8fac5e" ON "transactionReceipts" ("number") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_98ff447fd46a5b297f0ddb4aff" ON "transactionReceipts" ("contractAddress") `
    );
    await queryRunner.query(`CREATE INDEX "IDX_78b6dc1fe9600ba7de18fec127" ON "transactionReceipts" ("blockNumber") `);
    await queryRunner.query(
      `CREATE TABLE "pointsHistory" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "address" bytea NOT NULL, "blockNumber" bigint NOT NULL, "stakePoint" bigint NOT NULL, "refPoint" bigint NOT NULL, CONSTRAINT "PK_3d3989db885fde70a502ffa3264" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_b1b95df312364b2d2ce420b2c8" ON "pointsHistory" ("address") `);
    await queryRunner.query(
      `CREATE TABLE "points" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "address" bytea NOT NULL, "stakePoint" bigint NOT NULL, "refPoint" bigint NOT NULL, CONSTRAINT "PK_c9bd7c6da50151b24c19e90a0f5" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_186821d745a802779bae61192c" ON "points" ("address") `);
    await queryRunner.query(
      `CREATE TABLE "logs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "blockNumber" bigint NOT NULL, "transactionHash" bytea, "transactionIndex" integer NOT NULL, "removed" boolean, "address" bytea NOT NULL, "data" bytea NOT NULL, "topics" bytea array NOT NULL, "logIndex" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_36bce79ebd6dc60ae57e2382ae7" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_802e133f929cd9a9e0db73ed7f" ON "logs" ("blockNumber") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_ebbb1251d0299f223e2d45f98f" ON "logs" ("address", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98f7030b89509e25e434fb2e93" ON "logs" ("transactionHash", "timestamp", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90ca67f84ee01d5122f5de5454" ON "logs" ("address", "timestamp", "logIndex") `
    );
    await queryRunner.query(
      `CREATE TABLE "feeData" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "chainId" integer, "lastBaseFeePerGas" bytea NOT NULL, "maxFeePerGas" bytea NOT NULL, "maxPriorityFeePerGas" bytea NOT NULL, "gasPrice" bytea NOT NULL, CONSTRAINT "PK_9a5db944f2380c0831b06cf5209" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_b384b6e4ad2817bda522ce72bc" ON "feeData" ("chainId") `);
    await queryRunner.query(
      `CREATE TABLE "counters" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" bigint NOT NULL, "tableName" character varying(64) NOT NULL, "queryString" character varying NOT NULL, CONSTRAINT "PK_910bfcbadea9cde6397e0daf996" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_66408ca078e57aef487ad03b09" ON "counters" ("tableName", "queryString") `
    );
    await queryRunner.query(
      `CREATE TABLE "eventLogs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "id" integer, "contractAddress" bytea, "topic" bytea NOT NULL, "chainId" integer, "blockNumber" bigint NOT NULL, "logHash" bytea NOT NULL, "log" bytea NOT NULL, "executedAt" TIMESTAMP, CONSTRAINT "PK_80da7b1a5aff9773df1e89f02c3" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_a2130b97dacf2e7e7c90f84437" ON "eventLogs" ("blockNumber", "chainId") `);
    await queryRunner.query(
      `CREATE TABLE "counterStates" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tableName" character varying(64) NOT NULL, "lastProcessedRecordNumber" bigint NOT NULL, CONSTRAINT "PK_890a5ff8715895f763140d84207" PRIMARY KEY ("tableName"))`
    );
    await queryRunner.query(
      `CREATE TABLE "blockScanRange" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "from" bigint NOT NULL, "to" bigint NOT NULL, CONSTRAINT "PK_dc69d8f9251ba6eb702ca645330" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_b7fd23b95191d01e43d305ec9e" ON "blockScanRange" ("from") `);
    await queryRunner.query(
      `CREATE TABLE "batchRootEventLogs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "transactionHash" bytea NOT NULL, "rootHash" bytea NOT NULL, "executedAt" TIMESTAMP, "l1BatchNumber" bigint NOT NULL, "chainId" integer, CONSTRAINT "PK_92656647d06f2766fda258138e4" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b41b26847be744530965dbb747" ON "batchRootEventLogs" ("l1BatchNumber", "chainId") `
    );
    await queryRunner.query(
      `CREATE TABLE "blockConfirmations" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "confirmations" integer NOT NULL, "chainId" integer, CONSTRAINT "PK_f053b2604437b0349950f60bd0c" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_ab7d63458f769c42ad4fe7b3ac" ON "blockConfirmations" ("chainId") `);
    await queryRunner.query(
      `CREATE TABLE "eventProcess" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" bigint NOT NULL, "topic" bytea NOT NULL, "chainId" integer, "serverId" integer NOT NULL, "contractAddress" bytea, "processedBlockNumber" bigint NOT NULL, CONSTRAINT "PK_cdc166d653ea24cc45a0b6bc5b1" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5f27ed1ed261256abb7cad08d" ON "eventProcess" ("processedBlockNumber", "chainId") `
    );
    await queryRunner.query(
      `CREATE TABLE "addressTransactions" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "transactionHash" bytea NOT NULL, "address" bytea NOT NULL, "blockNumber" bigint NOT NULL, "receivedAt" TIMESTAMP NOT NULL, "transactionIndex" integer NOT NULL, CONSTRAINT "PK_bff95313b612d469b24715faded" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f47df88074738e8a6080e9bfc" ON "addressTransactions" ("transactionHash") `
    );
    await queryRunner.query(`CREATE INDEX "IDX_420e0bedaf4efe5b913ce0eb58" ON "addressTransactions" ("blockNumber") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_f8b841e005e13e12008d9778ed" ON "addressTransactions" ("address", "blockNumber", "receivedAt", "transactionIndex") `
    );
    await queryRunner.query(`CREATE TYPE "public"."addressTransfers_tokentype_enum" AS ENUM('ETH', 'ERC20', 'ERC721')`);
    await queryRunner.query(
      `CREATE TABLE "addressTransfers" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" BIGSERIAL NOT NULL, "transferNumber" bigint NOT NULL, "address" bytea NOT NULL, "tokenAddress" bytea, "blockNumber" bigint NOT NULL, "timestamp" TIMESTAMP NOT NULL, "tokenType" "public"."addressTransfers_tokentype_enum" NOT NULL DEFAULT 'ETH', "isFeeOrRefund" boolean NOT NULL, "fields" jsonb, "logIndex" integer NOT NULL, "isInternal" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7e3560fda9d203e4fcf10bd2335" PRIMARY KEY ("number"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_3b5bd7be245ef82949c1d6b2f7" ON "addressTransfers" ("transferNumber") `);
    await queryRunner.query(`CREATE INDEX "IDX_f7e8b7e5f35f01339f757048d9" ON "addressTransfers" ("blockNumber") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_aba2aae78e735a64d968f1ef3c" ON "addressTransfers" ("address", "isInternal", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3a14ae1d50aa1835187e4bb4a" ON "addressTransfers" ("address", "tokenType", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa3c56addbb167c7d036a7dc1e" ON "addressTransfers" ("address", "tokenAddress", "blockNumber", "logIndex") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c380daa3928098940aec1618b0" ON "addressTransfers" ("address", "isFeeOrRefund", "timestamp", "logIndex") `
    );
    await queryRunner.query(
      `CREATE TABLE "balances" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" bytea NOT NULL, "tokenAddress" bytea NOT NULL, "blockNumber" bigint NOT NULL, "balance" character varying(128) NOT NULL, CONSTRAINT "PK_31944b3c196600270049b2b7f1f" PRIMARY KEY ("address", "tokenAddress", "blockNumber"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_9c55e7453afdb89d5a1c65acf1" ON "balances" ("blockNumber", "balance") `);
    await queryRunner.query(
      `CREATE TABLE "addresses" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" bytea NOT NULL, "bytecode" bytea NOT NULL, "createdInBlockNumber" bigint, "creatorTxHash" bytea, "createdInLogIndex" integer, "creatorAddress" bytea, CONSTRAINT "PK_69b31ba33682e27f43b4754126a" PRIMARY KEY ("address"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_ac13a40a9b8db62625a6eeb051" ON "addresses" ("createdInBlockNumber") `);
    await queryRunner.query(`CREATE INDEX "IDX_a24a74fdf520375abc7a7eb188" ON "addresses" ("creatorTxHash") `);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_a629587e749dda5721fed9a5c39" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_5165fcd06a6954903a1d5f52015" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_32d1fee33194687356298e56b86" FOREIGN KEY ("transactionHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_730b817608cd0ed733d5b548373" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_c4133312072d8f3064e441c82bb" FOREIGN KEY ("transactionHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactionReceipts" ADD CONSTRAINT "FK_1236ec3b6419b8e843af9807a07" FOREIGN KEY ("transactionHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactionReceipts" ADD CONSTRAINT "FK_78b6dc1fe9600ba7de18fec1273" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "FK_802e133f929cd9a9e0db73ed7ff" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "FK_cf3cf6b059a0a710d026b68a343" FOREIGN KEY ("transactionHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addressTransactions" ADD CONSTRAINT "FK_4f47df88074738e8a6080e9bfc0" FOREIGN KEY ("transactionHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addressTransactions" ADD CONSTRAINT "FK_420e0bedaf4efe5b913ce0eb587" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addressTransfers" ADD CONSTRAINT "FK_3b5bd7be245ef82949c1d6b2f79" FOREIGN KEY ("transferNumber") REFERENCES "transfers"("number") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addressTransfers" ADD CONSTRAINT "FK_f7e8b7e5f35f01339f757048d9b" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "balances" ADD CONSTRAINT "FK_72541bf4560e938ac13a0e936c8" FOREIGN KEY ("blockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_ac13a40a9b8db62625a6eeb0512" FOREIGN KEY ("createdInBlockNumber") REFERENCES "blocks"("number") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_a24a74fdf520375abc7a7eb1882" FOREIGN KEY ("creatorTxHash") REFERENCES "transactions"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_a24a74fdf520375abc7a7eb1882"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_ac13a40a9b8db62625a6eeb0512"`);
    await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_72541bf4560e938ac13a0e936c8"`);
    await queryRunner.query(`ALTER TABLE "addressTransfers" DROP CONSTRAINT "FK_f7e8b7e5f35f01339f757048d9b"`);
    await queryRunner.query(`ALTER TABLE "addressTransfers" DROP CONSTRAINT "FK_3b5bd7be245ef82949c1d6b2f79"`);
    await queryRunner.query(`ALTER TABLE "addressTransactions" DROP CONSTRAINT "FK_420e0bedaf4efe5b913ce0eb587"`);
    await queryRunner.query(`ALTER TABLE "addressTransactions" DROP CONSTRAINT "FK_4f47df88074738e8a6080e9bfc0"`);
    await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_cf3cf6b059a0a710d026b68a343"`);
    await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_802e133f929cd9a9e0db73ed7ff"`);
    await queryRunner.query(`ALTER TABLE "transactionReceipts" DROP CONSTRAINT "FK_78b6dc1fe9600ba7de18fec1273"`);
    await queryRunner.query(`ALTER TABLE "transactionReceipts" DROP CONSTRAINT "FK_1236ec3b6419b8e843af9807a07"`);
    await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_c4133312072d8f3064e441c82bb"`);
    await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_730b817608cd0ed733d5b548373"`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_32d1fee33194687356298e56b86"`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_5165fcd06a6954903a1d5f52015"`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_a629587e749dda5721fed9a5c39"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a24a74fdf520375abc7a7eb188"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ac13a40a9b8db62625a6eeb051"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9c55e7453afdb89d5a1c65acf1"`);
    await queryRunner.query(`DROP TABLE "balances"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c380daa3928098940aec1618b0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_aa3c56addbb167c7d036a7dc1e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e3a14ae1d50aa1835187e4bb4a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_aba2aae78e735a64d968f1ef3c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f7e8b7e5f35f01339f757048d9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3b5bd7be245ef82949c1d6b2f7"`);
    await queryRunner.query(`DROP TABLE "addressTransfers"`);
    await queryRunner.query(`DROP TYPE "public"."addressTransfers_tokentype_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f8b841e005e13e12008d9778ed"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_420e0bedaf4efe5b913ce0eb58"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4f47df88074738e8a6080e9bfc"`);
    await queryRunner.query(`DROP TABLE "addressTransactions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d5f27ed1ed261256abb7cad08d"`);
    await queryRunner.query(`DROP TABLE "eventProcess"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ab7d63458f769c42ad4fe7b3ac"`);
    await queryRunner.query(`DROP TABLE "blockConfirmations"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b41b26847be744530965dbb747"`);
    await queryRunner.query(`DROP TABLE "batchRootEventLogs"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b7fd23b95191d01e43d305ec9e"`);
    await queryRunner.query(`DROP TABLE "blockScanRange"`);
    await queryRunner.query(`DROP TABLE "counterStates"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a2130b97dacf2e7e7c90f84437"`);
    await queryRunner.query(`DROP TABLE "eventLogs"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_66408ca078e57aef487ad03b09"`);
    await queryRunner.query(`DROP TABLE "counters"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b384b6e4ad2817bda522ce72bc"`);
    await queryRunner.query(`DROP TABLE "feeData"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_90ca67f84ee01d5122f5de5454"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_98f7030b89509e25e434fb2e93"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ebbb1251d0299f223e2d45f98f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_802e133f929cd9a9e0db73ed7f"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_186821d745a802779bae61192c"`);
    await queryRunner.query(`DROP TABLE "points"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b1b95df312364b2d2ce420b2c8"`);
    await queryRunner.query(`DROP TABLE "pointsHistory"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78b6dc1fe9600ba7de18fec127"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_98ff447fd46a5b297f0ddb4aff"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d79410e38050a25a02ea8fac5e"`);
    await queryRunner.query(`DROP TABLE "transactionReceipts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0e9e7b97000e369771bfe87351"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a870be7457f3f683510a83a66b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81191c296b89f6e7bbe819b995"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_22c850c7584a8727b44eb4decf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6b29485268b54ac40f41e8bb49"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_730b817608cd0ed733d5b54837"`);
    await queryRunner.query(`DROP TABLE "transfers"`);
    await queryRunner.query(`DROP TYPE "public"."transfers_tokentype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transfers_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c45d488f03a4724a1b8490068c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f9d4a596adf95ca64ed98810fd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_32d1fee33194687356298e56b8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eab106a9418a761805c415fdeb"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6ea59f03238929aef98674f87d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c41a3520808b2c207d4343aa46"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ea74bf1e592f259b3e64884eb7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_33d33b468baadbec2f94ce52d2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_23368dc6dbdbe92f83c8bb1fd8"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3f6b380e545dcfc23494af6196"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1ccfbf9a34c2be286db278de8c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6b08048b61bf9f4c139336a3b5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_00d4f3eb491f00ae5bece2a559"`);
    await queryRunner.query(`DROP TABLE "blocks"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e509df4634e707a7e96f65c081"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_468b5ed00f6d47b1552970b2bb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2e5848205f50af3d87131715e9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_01dcdc0d294fbdffb0460c6c47"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4b496810fff6ce2504f6f7a512"`);
    await queryRunner.query(`DROP TABLE "batches"`);
  }
}
