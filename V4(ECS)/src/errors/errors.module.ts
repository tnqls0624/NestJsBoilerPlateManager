import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "@project/domain/entity/project.entity";
import { Users } from "@user/domain/entity/user.entity";
import { ErrorsController } from "@errors/controller/errors.controller";
import { Errors } from "@errors/domain/entity/errors.entity";
import { ErrorsRepository } from "@errors/infra/errors.repository";
import { ErrorsService } from "@errors/service/errors.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Project, Errors])],
  controllers: [ErrorsController],
  providers: [ErrorsService, ErrorsRepository],
  exports: [ErrorsService, ErrorsRepository],
})
export class ErrorsModule {}
