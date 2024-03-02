import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { bigIntNumberTransformer } from "../transformers/bigIntNumber.transformer";
import { hash64HexTransformer } from "../transformers/hash64Hex.transformer";
import { hexTransformer } from "../transformers/hex.transformer";

@Index(["processedBlockNumber", "chainId"])
@Entity({ name: "eventProcess" })
export class eventProcess extends BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly number: number;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly topic: string;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly chainId: number;

  @Column({ type: "int" })
  public readonly serverId: number;

  @Column({ type: "bytea", nullable: true, transformer: hexTransformer })
  public readonly contractAddress?: string;

  @Column({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly processedBlockNumber: number;
}
