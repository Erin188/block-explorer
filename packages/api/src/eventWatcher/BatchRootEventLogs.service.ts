import { Injectable } from "@nestjs/common";
import { Repository, FindOptionsWhere, FindOptionsOrder, FindOptionsRelations } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { paginate } from "../common/utils";
import { IPaginationOptions } from "../common/types";
import { BatchRootEventLogs } from "./entity/batchRootEventLogs.entity";

@Injectable()
export class BatchRootEventLogsService {
  public constructor(
    @InjectRepository(BatchRootEventLogs)
    private readonly batchRootEventLogsRepository: Repository<BatchRootEventLogs>
  ) {}

  private getBatchRootEventLogs(
    filterOptions: FindOptionsWhere<BatchRootEventLogs>,
    orderOptions: FindOptionsOrder<BatchRootEventLogs>
  ): Promise<BatchRootEventLogs> {
    return this.batchRootEventLogsRepository.findOne({
      where: filterOptions,
      order: orderOptions,
      select: { number: true },
    });
  }

  public async getLastBatchRootEventLogsNumber(): Promise<number> {
    const lastBatchRootEventLogs = await this.getBatchRootEventLogs({}, { number: "DESC" });
    return lastBatchRootEventLogs?.number || 0;
  }

  private async count(filterOptions: FindOptionsWhere<BatchRootEventLogs>): Promise<number> {
    const [lastBatchRootEventLogs, firstBatchRootEventLogs] = await Promise.all([
      this.getBatchRootEventLogs(filterOptions, { number: "DESC" }),
      this.getBatchRootEventLogs(filterOptions, { number: "ASC" }),
    ]);
    return lastBatchRootEventLogs?.number ? lastBatchRootEventLogs.number - firstBatchRootEventLogs.number + 1 : 0;
  }

  public async findAll(
    filterOptions: FindOptionsWhere<BatchRootEventLogs>,
    paginationOptions: IPaginationOptions
  ): Promise<Pagination<BatchRootEventLogs>> {
    const finalFilterOption = paginationOptions.filterOptions?.address
      ? {
          address: paginationOptions.filterOptions?.address,
        }
      : {};
    const queryBuilder = this.batchRootEventLogsRepository
      .createQueryBuilder("batchRootEventLogs")
      .where(finalFilterOption)
      .orderBy("batchRootEventLogs.number", "DESC");

    return await paginate<BatchRootEventLogs>(queryBuilder, paginationOptions, () => this.count(filterOptions));
  }
}
