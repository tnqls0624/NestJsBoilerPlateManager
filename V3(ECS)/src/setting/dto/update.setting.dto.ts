import { PickType } from "@nestjs/swagger";
import { Setting } from "../domain/setting.entity";

export class UpdateSettingDto extends PickType(Setting, [
  "isActive",
] as const) {}
