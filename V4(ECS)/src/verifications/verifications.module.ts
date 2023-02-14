import { Logger, Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "@auth/auth.module";
import { Users } from "@user/domain/entity/user.entity";
import { UserModule } from "@user/user.module";
import { VerificationsController } from "@verifications/controller/verificationsController";
import { Verification } from "@verifications/domain/entity/verifications.entity";
import { VerificationsRepository } from "@verifications/infra/verifications.repository";
import { VerificationsService } from "@verifications/service/verifications.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Verification]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [VerificationsController],
  providers: [VerificationsService, Logger, VerificationsRepository],
  exports: [VerificationsService, VerificationsRepository],
})
export class VerificationsModule {}
