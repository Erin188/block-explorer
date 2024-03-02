import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { bigIntNumberTransformer } from "../transformers/bigIntNumber.transformer";
import { hash64HexTransformer } from "../transformers/hash64Hex.transformer";
import { hexTransformer } from "../transformers/hex.transformer";

@Index(["chainId"])
@Entity({ name: "blockConfirmations" })
export class blockConfirmations extends BaseEntity {
  @PrimaryColumn({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly number: number;

  @Column({ type: "int" })
  public readonly confirmations: number;

  @Column({ type: "int", nullable: true, transformer: hexTransformer })
  public readonly chainId: number;
}
