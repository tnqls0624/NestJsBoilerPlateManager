import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingController } from "./controller/setting.controller";
import { Setting } from "./domain/setting.entity";
import { SettingRepository } from "./infra/setting.repository";
import { SettingService } from "./service/setting.service";

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService, SettingRepository],
  exports: [SettingService, SettingRepository],
})
export class SettingModule {}
