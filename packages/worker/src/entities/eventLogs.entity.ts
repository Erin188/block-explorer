import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { bigIntNumberTransformer } from "../transformers/bigIntNumber.transformer";
import { hash64HexTransformer } from "../transformers/hash64Hex.transformer";
import { hexTransformer } from "../transformers/hex.transformer";

@Index(["blockNumber", "chainId"])
@Entity({ name: "eventLogs" })
export class eventLogs extends BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly number: number;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly id: number;

  @Column({ type: "bytea", nullable: true, transformer: hexTransformer })
  public readonly contractAddress?: string;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly topic: string;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly chainId: number;

  @Column({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly blockNumber: number;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly logHash: string;

  @Column({ type: "bytea", transformer: hexTransformer })
  public readonly log: string;

  @Column({ type: "timestamp", nullable: true })
  public readonly executedAt?: Date;
}
