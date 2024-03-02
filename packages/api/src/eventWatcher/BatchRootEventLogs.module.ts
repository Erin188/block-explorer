import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BatchRootEventLogsService } from "./BatchRootEventLogs.service";
import { BatchRootEventLogsController } from "./BatchRootEventLogs.controller";
import { BatchRootEventLogs } from "./entity/batchRootEventLogs.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BatchRootEventLogs])],
  controllers: [BatchRootEventLogsController],
  providers: [BatchRootEventLogsService],
  exports: [BatchRootEventLogsService],
})
export class BatchRootEventLogsModule {}
