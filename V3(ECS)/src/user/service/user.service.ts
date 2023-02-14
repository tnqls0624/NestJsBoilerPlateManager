import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { UserRepository } from '../infra/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly connection: Connection,
  ) {}
  private static readonly logger = new Logger('user');
  async findUser(signname: string) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');
    await queryRunner.connect();
    try {
      const result = await this.userRepository.findUser(
        signname,
        queryRunner.manager,
      );
      return result;
    } catch (error) {
      UserService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicatedSignname(signname: string) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');
    await queryRunner.connect();
    try {
      const result = await this.userRepository.duplicateUser(
        signname,
        queryRunner.manager,
      );
      return result;
    } catch (error) {
      UserService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicatedEmail(email: string) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');
    await queryRunner.connect();
    try {
      const result = await this.userRepository.checkDuplicatedEmail(
        email,
        queryRunner.manager,
      );
      return result;
    } catch (error) {
      UserService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicatedPhone(phone: string) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');
    await queryRunner.connect();
    try {
      const result = await this.userRepository.checkDuplicatedPhone(
        phone,
        queryRunner.manager,
      );
      return result;
    } catch (error) {
      UserService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
