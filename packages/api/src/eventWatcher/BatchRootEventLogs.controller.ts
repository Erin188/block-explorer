import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBadRequestResponse, ApiExcludeController } from "@nestjs/swagger";
import { buildDateFilter } from "../common/utils";
import { PagingOptionsDto } from "../common/dtos";
import { BatchRootEventLogsService } from "./BatchRootEventLogs.service";
import { swagger } from "../config/featureFlags";

const entityName = "batchRootEventLogs";

@ApiTags("BatchRootEventLogs")
@ApiExcludeController(!swagger.bffEnabled)
@Controller(entityName)
export class BatchRootEventLogsController {
  constructor(private readonly BatchRootEventLogsService: BatchRootEventLogsService) {}

  @Get("")
  @ApiBadRequestResponse({ description: "Query params are not valid or out of range" })
  public async getBatchRootEventLogsLogs(
    @Query() listFilterOptions: any,
    @Query() pagingOptions: PagingOptionsDto
  ): Promise<any> {
    const filterCriteria = buildDateFilter(listFilterOptions.fromDate, listFilterOptions.toDate);
    return await this.BatchRootEventLogsService.findAll(filterCriteria, {
      filterOptions: listFilterOptions,
      ...pagingOptions,
      route: entityName,
      canUseNumberFilterAsOffset: true,
    });
  }
}
