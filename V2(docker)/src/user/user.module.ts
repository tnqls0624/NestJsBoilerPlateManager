import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/domain/entity/auth.entity';
import { AuthRepository } from 'src/auth/infra/auth.repository';
import { AuthService } from 'src/auth/service/auth.service';
import { Varification } from 'src/varifications/domain/entity/varifications.entity';
import { VarificationsRepository } from 'src/varifications/infra/varifications.repository';
import { VarificationsService } from 'src/varifications/service/varifications.service';
import { UserController } from './controller/user.controller';
import { Users } from './domain/entity/user.entity';
import { UserRepository } from './infra/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Auth, Varification])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AuthService,
    JwtService,
    AuthRepository,
    VarificationsService,
    VarificationsRepository,
    Logger,
  ],
})
export class UserModule {}
