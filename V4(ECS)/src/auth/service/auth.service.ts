import { HttpException, Injectable, Logger } from "@nestjs/common";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginUserDto } from "@auth/dto/action/loginUser.dto";
import { UserRepository } from "@user/infra/user.repository";
import { UserTypeEnum } from "@user/domain/entity/user.entity";
import { AuthRepository } from "@auth/infra/auth.repository";
import { UpdateUserDto } from "@auth/dto/action/updateUser.dto";
import { UserDto } from "@user/dto/user/user.dto";
import { PasswordChangeDto } from "@auth/dto/action/passwordChange.dto";
import { FindPasswordChangeDto } from "@auth/dto/action/findPasswordChange.dto";
import { JoinUserDto } from "@auth/dto/action/joinUser.dto";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersRepository: UserRepository,
    private readonly authRepository: AuthRepository
  ) {}
  private static readonly logger = new Logger("auth");

  async validateUser(signname: string, password: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");

    await queryRunner.connect();
    try {
      const user = await this.usersRepository.findUser(
        signname,
        queryRunner.manager
      );
      if (!user) {
        throw new HttpException("Not User", 400);
      }
      const bcryptPassWord = await bcrypt.compare(password, user.password);
      if (bcryptPassWord) {
        const { password, withdraw_at, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      AuthService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * JWT
   */
  async jwtLogIn(data: LoginUserDto) {
    const { signname, password } = data;
    await this.validateUser(signname, password);
    const accessToken = this.jwtService.sign(data, {
      secret: this.config.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
    });
    return {
      accessToken,
    };
  }

  /**
   * 유저 회원가입
   */
  async createUser(body: JoinUserDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      body.password = await bcrypt.hash(body.password, 12);
      const args = {
        ...body,
        withdraw: false,
        verifyMail: false,
      };
      const result = await this.authRepository.createUser(
        args,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      AuthService.logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 로그인
   */
  async loginUser(body: LoginUserDto) {
    if (body.method === UserTypeEnum.SIGNNAME) {
      const { accessToken } = await this.jwtLogIn(body);
      return accessToken;
    }
    return null;
  }

  /**
   * 유저 정보 수정
   */
  async updateUser(signname: string, body: UpdateUserDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.authRepository.updateUser(
        signname,
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 비밀번호 변경
   */
  async changePassword(user: UserDto, body: PasswordChangeDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.authRepository.changePassword(
        user,
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 비밀번호 찾기 후 비밀번호 변경
   */
  async findPasswordChange(key: string, body: FindPasswordChangeDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.authRepository.findPasswordChange(
        key,
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 탈퇴
   */
  async deleteUser(user: UserDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.authRepository.deleteUser(
        user,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
