import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './service/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { Users } from 'src/user/domain/entity/user.entity';
import { Auth } from './domain/entity/auth.entity';
import { AuthRepository } from './infra/auth.repository';
import { UserRepository } from 'src/user/infra/user.repository';
import { VerificationsService } from 'src/verifications/service/verifications.service';
import { VerificationsRepository } from 'src/verifications/infra/verifications.repository';
import { Verification } from 'src/verifications/domain/entity/verifications.entity';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Users, Auth, Verification]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthRepository,
    UserRepository,
    VerificationsService,
    VerificationsRepository,
    Logger,
  ],
})
export class AuthModule {}
