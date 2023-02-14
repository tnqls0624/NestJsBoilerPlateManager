import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Users } from "@user/domain/entity/user.entity";
import { UserRepository } from "@user/infra/user.repository";
import { EntityManager } from "typeorm";
import {
  Verification,
  VerificationTypeEnum,
} from "@verifications/domain/entity/verifications.entity";
import { VerifyMailDto } from "@verifications/dto/verifyMailDto";

@Injectable()
export class VerificationsRepository {
  constructor(private readonly userRepository: UserRepository) {}

  private static readonly logger: Logger = new Logger("verification");

  async requestMail(
    args: {
      type: VerificationTypeEnum;
      to: string;
      token: string;
      key: string;
      user_id: number;
    },
    manager: EntityManager
  ) {
    await this.userRepository.findUserId(args.user_id, manager);
    const verify: Verification = await manager.findOne(Verification, {
      where: {
        type: args.type,
        user_id: args.user_id,
      },
    });

    if (verify) {
      await manager.update(
        Verification,
        {
          id: verify.id,
        },
        {
          token: args.token,
          key: args.key,
        }
      );
    } else {
      await manager.save(Verification, args);
    }
    return args.token;
  }

  async verifyMail(body: VerifyMailDto, manager: EntityManager) {
    const { token, key } = body;

    const verification: Verification = await this.verifyMailTokenAndKey(
      token,
      key,
      manager
    );
    const updateVerify = await this.updateVerify(verification, manager);
    const deleteVerify = await this.removeVerify(verification, manager);
    if (!updateVerify || !deleteVerify) {
      throw new HttpException("메일 업데이트 에러", 400);
    }
    return true;
  }

  async removeVerify(verification: Verification, manager: EntityManager) {
    await manager.remove(Verification, verification);
    return true;
  }

  async updateVerify(verification: Verification, manager: EntityManager) {
    await manager.update(
      Users,
      {
        id: verification.user_id,
      },
      {
        verifyMail: true,
      }
    );
    return true;
  }

  async verifyMailTokenAndKey(
    token: string,
    key: string,
    manager: EntityManager
  ) {
    const verification: Verification = await manager.findOne(Verification, {
      where: { token, key },
    });
    if (!verification) {
      VerificationsRepository.logger.error("토큰이 존재하지 않습니다");
      throw new HttpException("invalid token", 400);
    }
    return verification;
  }

  async verifyMailKey(key: string, user_id: number, manager: EntityManager) {
    const verification: Verification = await manager.findOne(Verification, {
      where: { type: VerificationTypeEnum.PASSWORD, key, user_id },
    });
    if (!verification) {
      VerificationsRepository.logger.error("키값이 존재하지 않습니다");
      throw new HttpException("not key", 400);
    }
    return verification;
  }
}
