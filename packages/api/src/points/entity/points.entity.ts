import { Entity, Column, Index, PrimaryColumn } from "typeorm";
import { CountableEntity } from "./countable.entity";
import { bigIntNumberTransformer } from "../../common/transformers/bigIntNumber.transformer";
import { hexTransformer } from "../../common/transformers/hex.transformer";

@Entity({ name: "points" })
export class Points extends CountableEntity {
  @PrimaryColumn({ generated: true, type: "bigint" })
  public override readonly number: number;

  @Index()
  @Column({ type: "bytea", transformer: hexTransformer })
  public readonly address: string;

  @Column({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly stakePoint: number;

  @Column({ type: "bigint", transformer: bigIntNumberTransformer })
  public readonly refPoint: number;
}
