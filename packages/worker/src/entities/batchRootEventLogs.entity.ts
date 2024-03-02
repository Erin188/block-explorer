import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { bigIntNumberTransformer } from "../transformers/bigIntNumber.transformer";
import { hash64HexTransformer } from "../transformers/hash64Hex.transformer";
import { hexTransformer } from "../transformers/hex.transformer";

@Index(["l1BatchNumber", "chainId"])
@Entity({ name: "batchRootEventLogs" })
export class batchRootEventLogs extends BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly number: number;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly transactionHash: string;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly rootHash: string;

  @Column({ type: "timestamp", nullable: true })
  public readonly executedAt?: Date;

  @Column({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly l1BatchNumber: number;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly chainId: number;
}
