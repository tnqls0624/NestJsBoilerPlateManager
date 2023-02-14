import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Connection, QueryRunner } from "typeorm";
import { UpdateSettingDto } from "../dto/update.setting.dto";
import { SettingRepository } from "../infra/setting.repository";

@Injectable()
export class SettingService {
  constructor(
    private readonly settingRepository: SettingRepository,
    private readonly connection: Connection
  ) {}
  private static readonly logger: Logger = new Logger("setting");
  async findSetting() {
    const queryRunner: QueryRunner = this.connection.createQueryRunner("slave");
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
      this.connection.createQueryRunner("master");
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
