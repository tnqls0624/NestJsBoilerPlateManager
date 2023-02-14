import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Connection, DataSource, QueryRunner } from "typeorm";
import { UserRepository } from "@user/infra/user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository
  ) {}
  private static readonly logger = new Logger("user");

  async findUser(signname: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const user = await this.userRepository.findUser(
        signname,
        queryRunner.manager
      );
      if (!user) {
        UserService.logger.error("존재하지 않는 유저입니다");
        throw new HttpException("not user", 400);
      }
      return user;
    } catch (error) {
      UserService.logger.error(error);
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async findUserId(userId: number) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const user = await this.userRepository.findUserId(
        userId,
        queryRunner.manager
      );
      if (!user) {
        UserService.logger.error("존재하지 않는 유저입니다");
        throw new HttpException("not user", 400);
      }
    } catch (error) {
      UserService.logger.error(error);
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicatedSignname(signname: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const user = await this.userRepository.duplicateUser(
        signname,
        queryRunner.manager
      );
      if (user) {
        UserService.logger.error("중복된 이메일입니다");
        throw new HttpException("duplicate user", 400);
      }
      return true;
    } catch (error) {
      UserService.logger.error(error);
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicatedEmail(email: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const user = await this.userRepository.checkDuplicatedEmail(
        email,
        queryRunner.manager
      );
      if (user) {
        UserService.logger.error("중복된 이메일입니다");
        throw new HttpException("duplicate email", 400);
      }
      return true;
    } catch (error) {
      UserService.logger.error(error);
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
