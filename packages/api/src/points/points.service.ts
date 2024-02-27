import { Injectable } from "@nestjs/common";
import { Repository, FindOptionsWhere, FindOptionsOrder, FindOptionsRelations } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { paginate } from "../common/utils";
import { IPaginationOptions } from "../common/types";
import { Points } from "./entity/points.entity";
import { PointsHistory } from "./entity/pointsHistory.entity";

@Injectable()
export class PointsService {
  public constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(PointsHistory)
    private readonly pointsHistoryRepository: Repository<PointsHistory>
  ) {}

  private getPoints(filterOptions: FindOptionsWhere<Points>, orderOptions: FindOptionsOrder<Points>): Promise<Points> {
    return this.pointsRepository.findOne({
      where: filterOptions,
      order: orderOptions,
      select: { number: true },
    });
  }

  public async getLastPointsNumber(): Promise<number> {
    const lastPoints = await this.getPoints({}, { number: "DESC" });
    return lastPoints?.number || 0;
  }

  private async count(filterOptions: FindOptionsWhere<Points>): Promise<number> {
    const [lastPoints, firstPoints] = await Promise.all([
      this.getPoints(filterOptions, { number: "DESC" }),
      this.getPoints(filterOptions, { number: "ASC" }),
    ]);
    return lastPoints?.number ? lastPoints.number - firstPoints.number + 1 : 0;
  }

  public async findAll(
    filterOptions: FindOptionsWhere<Points>,
    paginationOptions: IPaginationOptions
  ): Promise<Pagination<Points>> {
    const finalFilterOption = paginationOptions.filterOptions?.address
      ? {
          address: paginationOptions.filterOptions?.address,
        }
      : {};
    const queryBuilder = this.pointsRepository
      .createQueryBuilder("points")
      .where(finalFilterOption)
      .orderBy("points.number", "DESC");

    return await paginate<Points>(queryBuilder, paginationOptions, () => this.count(filterOptions));
  }

  // historical points
  private getPointsHistory(
    filterOptions: FindOptionsWhere<PointsHistory>,
    orderOptions: FindOptionsOrder<PointsHistory>
  ): Promise<PointsHistory> {
    return this.pointsHistoryRepository.findOne({
      where: filterOptions,
      order: orderOptions,
      select: { number: true },
    });
  }

  public async getLastPointsHistoryNumber(): Promise<number> {
    const lastPointsHistory = await this.getPointsHistory({}, { number: "DESC" });
    return lastPointsHistory?.number || 0;
  }

  private async countHistory(filterOptions: FindOptionsWhere<PointsHistory>): Promise<number> {
    const [lastPointsHistory, firstPointsHistory] = await Promise.all([
      this.getPointsHistory(filterOptions, { number: "DESC" }),
      this.getPointsHistory(filterOptions, { number: "ASC" }),
    ]);
    return lastPointsHistory?.number ? lastPointsHistory.number - firstPointsHistory.number + 1 : 0;
  }

  public async findHistoryAll(
    filterOptions: FindOptionsWhere<PointsHistory>,
    paginationOptions: IPaginationOptions
  ): Promise<Pagination<PointsHistory>> {
    const finalFilterOption = paginationOptions.filterOptions?.address
      ? {
          address: paginationOptions.filterOptions?.address,
        }
      : {};
    const queryBuilder = this.pointsHistoryRepository
      .createQueryBuilder("pointsHistory")
      .where(finalFilterOption)
      .orderBy("pointsHistory.number", "DESC");

    return await paginate<PointsHistory>(queryBuilder, paginationOptions, () => this.countHistory(filterOptions));
  }
}
