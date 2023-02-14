import { Logger, Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "@auth/service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "@auth/service/jwt.strategy";
import { AuthController } from "@auth/controller/auth.controller";
import { Users } from "@user/domain/entity/user.entity";
import { AuthRepository } from "@auth/infra/auth.repository";
import { Verification } from "@verifications/domain/entity/verifications.entity";
import { UserModule } from "@user/user.module";
import { VerificationsModule } from "@verifications/verifications.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: config.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
        },
      }),
    }),
    TypeOrmModule.forFeature([Users, Verification]),
    VerificationsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, Logger],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
