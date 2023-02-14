import { HttpException, Injectable } from '@nestjs/common';
import { Users } from 'src/user/domain/entity/user.entity';
import { UserRepository } from 'src/user/infra/user.repository';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import {
  Verification,
  VerificationTypeEnum,
} from '../domain/entity/verifications.entity';

@Injectable()
export class VerificationsRepository {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly connection: Connection,
  ) {}

  async requestMail(
    args: {
      type: VerificationTypeEnum;
      to: string;
      token: string;
      key: string;
      user_id: number;
    },
    manager: EntityManager,
  ) {
    await this.userRepository.findUserId(args.user_id, manager);

    const verify = await manager.findOne(Verification, {
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
        },
      );
    } else {
      await manager.save(Verification, args);
    }

    return args.token;
  }

  async removeVerify(varification: Verification) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.remove(Verification, varification);
      await queryRunner.commitTransaction();
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async updateVerify(verification: Verification) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Users,
        {
          id: verification.user_id,
        },
        {
          verifymail: true,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async verifyMailTokenAndKey(
    token: string,
    key: string,
    manager: EntityManager,
  ) {
    const verification = await manager.findOne(Verification, {
      where: { token, key },
    });
    if (!verification) throw new HttpException('invalid token', 400);
    return verification;
  }

  async verifyMailKey(key: string, user_id: number, manager: EntityManager) {
    const verification = await manager.findOne(Verification, {
      where: { type: VerificationTypeEnum.PASSWORD, key, user_id },
    });
    if (!verification) throw new HttpException('not key', 400);
    return verification;
  }
}
