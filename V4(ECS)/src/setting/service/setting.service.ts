import { HttpException, Injectable, Logger } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { UpdateSettingDto } from "@setting/dto/update.setting.dto";
import { SettingRepository } from "@setting/infra/setting.repository";

@Injectable()
export class SettingService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly settingRepository: SettingRepository
  ) {}
  private static readonly logger: Logger = new Logger("setting");
  async findSetting() {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      return this.settingRepository.findSetting(queryRunner.manager);
    } catch (error) {
      SettingService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async updateSetting(body: UpdateSettingDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.settingRepository.updateSetting(
        body.isActive,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      SettingService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
