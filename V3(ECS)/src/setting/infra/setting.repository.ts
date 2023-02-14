import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Setting } from "../domain/setting.entity";

@Injectable()
export class SettingRepository {
  constructor() {}

  async findSetting(manager: EntityManager) {
    const result = await manager.find(Setting, {});
    return result[0];
  }

  async updateSetting(isActive: boolean, manager: EntityManager) {
    await manager.update(Setting, { id: 1 }, { isActive });
    return true;
  }
}
