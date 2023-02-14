import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/domain/entity/auth.entity';
import { AuthRepository } from 'src/auth/infra/auth.repository';
import { Users } from 'src/user/domain/entity/user.entity';
import { UserRepository } from 'src/user/infra/user.repository';
import { VerificationsController } from './controller/verifications.controller';
import { Verification } from './domain/entity/verifications.entity';
import { VerificationsRepository } from './infra/verifications.repository';
import { VerificationsService } from './service/verifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Auth, Verification])],
  controllers: [VerificationsController],
  providers: [
    VerificationsService,
    Logger,
    UserRepository,
    VerificationsRepository,
    AuthRepository,
  ],
})
export class VarificationsModule {}
