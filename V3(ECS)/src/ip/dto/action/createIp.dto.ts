import { PickType } from "@nestjs/swagger";
import { Ip } from "src/ip/domain/entity/ip.entity";

export class CreateIpDto extends PickType(Ip, [
  "address",
  "isActive",
  "memo",
] as const) {}
