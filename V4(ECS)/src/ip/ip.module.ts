import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "@user/domain/entity/user.entity";
import { IpController } from "@ip/controller/ip.controller";
import { Ip } from "@ip/domain/entity/ip.entity";
import { IpRepository } from "@ip/infra/ip.repository";
import { IpService } from "@ip/service/ip.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Ip])],
  controllers: [IpController],
  providers: [IpService, IpRepository],
  exports: [IpService, IpRepository],
})
export class IpModule {}
