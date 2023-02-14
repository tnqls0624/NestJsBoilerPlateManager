import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/domain/entity/auth.entity';
import { AuthRepository } from 'src/auth/infra/auth.repository';
import { Users } from 'src/user/domain/entity/user.entity';
import { UserRepository } from 'src/user/infra/user.repository';
import { VarificationsController } from './controller/varifications.controller';
import { Varification } from './domain/entity/varifications.entity';
import { VarificationsRepository } from './infra/varifications.repository';
import { VarificationsService } from './service/varifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Auth, Varification])],
  controllers: [VarificationsController],
  providers: [
    VarificationsService,
    Logger,
    UserRepository,
    VarificationsRepository,
    AuthRepository,
  ],
})
export class VarificationsModule {}
