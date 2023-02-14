import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/domain/entity/auth.entity';
import { AuthRepository } from 'src/auth/infra/auth.repository';
import { AuthService } from 'src/auth/service/auth.service';
import { Verification } from 'src/verifications/domain/entity/verifications.entity';
import { VerificationsRepository } from 'src/verifications/infra/verifications.repository';
import { VerificationsService } from 'src/verifications/service/verifications.service';
import { UserController } from './controller/user.controller';
import { Users } from './domain/entity/user.entity';
import { UserRepository } from './infra/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Auth, Verification])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AuthService,
    JwtService,
    AuthRepository,
    VerificationsService,
    VerificationsRepository,
    Logger,
  ],
})
export class UserModule {}
