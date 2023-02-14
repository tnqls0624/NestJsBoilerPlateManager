import { Logger, Module, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "@auth/auth.module";
import { Verification } from "@verifications/domain/entity/verifications.entity";
import { VerificationsModule } from "@verifications/verifications.module";
import { UserController } from "@user/controller/user.controller";
import { Users } from "@user/domain/entity/user.entity";
import { UserRepository } from "@user/infra/user.repository";
import { UserService } from "@user/service/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Verification]),
    forwardRef(() => VerificationsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, Logger],
  exports: [UserService, UserRepository],
})
export class UserModule {}
