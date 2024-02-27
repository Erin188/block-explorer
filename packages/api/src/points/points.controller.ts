import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBadRequestResponse, ApiExcludeController, ApiOkResponse } from "@nestjs/swagger";
import { buildDateFilter } from "../common/utils";
import { PagingOptionsDto, ListFiltersDto } from "../common/dtos";
import { PointsService } from "./points.service";
import { swagger } from "../config/featureFlags";

const entityName = "points";

@ApiTags("Points")
@ApiExcludeController(!swagger.bffEnabled)
@Controller(entityName)
export class PointsController {
  constructor(private readonly PointsService: PointsService) {}

  @Get("")
  @ApiBadRequestResponse({ description: "Query params are not valid or out of range" })
  public async getPoints(@Query() listFilterOptions: any, @Query() pagingOptions: PagingOptionsDto): Promise<any> {
    const filterCriteria = buildDateFilter(listFilterOptions.fromDate, listFilterOptions.toDate);
    return await this.PointsService.findAll(filterCriteria, {
      filterOptions: listFilterOptions,
      ...pagingOptions,
      route: entityName,
      canUseNumberFilterAsOffset: true,
    });
  }

  @Get("/history")
  @ApiBadRequestResponse({ description: "Query params are not valid or out of range" })
  public async getHistoryPoints(
    @Query() listFilterOptions: any,
    @Query() pagingOptions: PagingOptionsDto
  ): Promise<any> {
    const filterCriteria = buildDateFilter(listFilterOptions.fromDate, listFilterOptions.toDate);
    return await this.PointsService.findHistoryAll(filterCriteria, {
      filterOptions: listFilterOptions,
      ...pagingOptions,
      route: entityName,
      canUseNumberFilterAsOffset: true,
    });
  }
}
