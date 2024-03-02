import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { bigIntNumberTransformer } from "../transformers/bigIntNumber.transformer";
import { hash64HexTransformer } from "../transformers/hash64Hex.transformer";
import { hexTransformer } from "../transformers/hex.transformer";

@Index(["chainId"])
@Entity({ name: "feeData" })
export class feeData extends BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly number: number;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly chainId: number;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly lastBaseFeePerGas: string;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly maxFeePerGas: string;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly maxPriorityFeePerGas: string;

  @Column({ type: "bytea", nullable: false, transformer: hash64HexTransformer })
  public readonly gasPrice: string;
}
