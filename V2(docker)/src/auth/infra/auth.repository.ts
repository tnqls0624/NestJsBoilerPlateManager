import { HttpException, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Users, UserTypeEnum } from 'src/user/domain/entity/user.entity';
import { UpdateUserDto } from 'src/auth/dto/action/updateUser.dto';
import { UserDto } from 'src/user/dto/user/user.dto';
import { UserRepository } from 'src/user/infra/user.repository';
import { Connection, QueryRunner } from 'typeorm';
import { Auth } from '../domain/entity/auth.entity';
import { VarificationsRepository } from 'src/varifications/infra/varifications.repository';
import { hash } from 'bcrypt';
import { PasswordChangeDto } from '../dto/action/passwordChange.dto';
import { FindPasswordChangeDto } from '../dto/action/findPasswordChange.dto copy';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly connection: Connection,
    private readonly userRepository: UserRepository,
    private readonly varifyRepository: VarificationsRepository,
  ) {}

  /**
   * User 회원가입
   */
  async createUser(args: {
    withdraw: string;
    varifymail: string;
    method: UserTypeEnum;
    signname: string;
    password: string;
    name: string;
    email: string;
    phone: string;
  }): Promise<any> {
    const { signname } = args;

    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await this.userRepository.duplicateUser(signname);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.save(Users, args);
      const { password, ...userWithoutPassword } = user;
      await queryRunner.commitTransaction();
      return userWithoutPassword;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 회원 로그인
   */
  async loginUser(refreshToken: string, signname: string): Promise<boolean> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    const user = await this.userRepository.findUser(signname);

    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.upsert(
        Auth,
        [{ userId: String(user.id), refreshToken }],
        ['id'],
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  /**
   * 회원 정보 수정
   */
  async updateUser(signname: string, body: UpdateUserDto): Promise<boolean> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.findUser(signname);
      await queryRunner.manager.update(Users, { signname }, body);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(
    user: UserDto,
    body: PasswordChangeDto,
  ): Promise<boolean> {
    try {
      const newPassword = await hash(body.password, 12);
      user.password = newPassword;
      this.updateUser(user.signname, user);
      return true;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  /**
   * 비밀번호 찾기 후 변경
   */
  async findPasswordChange(
    key: string,
    body: FindPasswordChangeDto,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findUser(body.signname);

      const varification = await this.varifyRepository.varifyMailKey(
        key,
        user.id,
      );
      const newPassword = await hash(body.password, 12);
      user.password = newPassword;
      this.updateUser(user.signname, user);
      this.varifyRepository.removeVarify(varification);
      return true;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  /**
   * 회원 탈퇴
   */
  async deleteUser(user: UserDto): Promise<boolean> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.findUser(user.signname);
      await queryRunner.manager.update(
        Users,
        { signname: user.signname },
        {
          withdraw: 'true',
          withdraw_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      );
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
