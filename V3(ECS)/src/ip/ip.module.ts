import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/user/domain/entity/user.entity";
import { IpController } from "./controller/ip.controller";
import { Ip } from "./domain/entity/ip.entity";
import { IpRepository } from "./infra/ip.repository";
import { IpService } from "./service/ip.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Ip])],
  controllers: [IpController],
  providers: [IpService, IpRepository],
  exports: [IpService, IpRepository],
})
export class IpModule {}
