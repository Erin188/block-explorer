import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PointsService } from "./points.service";
import { PointsController } from "./points.controller";
import { Points } from "./entity/points.entity";
import { PointsHistory } from "./entity/pointsHistory.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Points, PointsHistory])],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
