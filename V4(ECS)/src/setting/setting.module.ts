import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingController } from "@setting/controller/setting.controller";
import { Setting } from "@setting/domain/setting.entity";
import { SettingRepository } from "@setting/infra/setting.repository";
import { SettingService } from "@setting/service/setting.service";

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService, SettingRepository],
  exports: [SettingService, SettingRepository],
})
export class SettingModule {}
