import { Injectable } from "@nestjs/common";
import moment from "moment";
import { Users, UserTypeEnum } from "@user/domain/entity/user.entity";
import { UpdateUserDto } from "@auth/dto/action/updateUser.dto";
import { UserDto } from "@user/dto/user/user.dto";
import { UserRepository } from "@user/infra/user.repository";
import { EntityManager } from "typeorm";
import { VerificationsRepository } from "@verifications/infra/verifications.repository";
import { hash } from "bcrypt";
import { PasswordChangeDto } from "@auth/dto/action/passwordChange.dto";
import { FindPasswordChangeDto } from "@auth/dto/action/findPasswordChange.dto";

@Injectable()
export class AuthRepository {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verifyRepository: VerificationsRepository
  ) {}

  /**
   * User 회원가입
   */
  async createUser(
    args: {
      withdraw: boolean;
      verifyMail: boolean;
      method: UserTypeEnum;
      signname: string;
      password: string;
      name: string;
      email: string;
    },
    manager: EntityManager
  ): Promise<any> {
    await this.userRepository.duplicateUser(args.signname, manager);
    const user = await manager.save(Users, args);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 회원 정보 수정
   */
  async updateUser(
    signname: string,
    body: UpdateUserDto,
    manager: EntityManager
  ): Promise<boolean> {
    await this.userRepository.findUser(signname, manager);
    await manager.update(Users, { signname }, body);
    return true;
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(
    user: UserDto,
    body: PasswordChangeDto,
    manager: EntityManager
  ): Promise<boolean> {
    user.password = await hash(body.password, 12);
    await this.updateUser(user.signname, user, manager);
    return true;
  }

  /**
   * 비밀번호 찾기 후 변경
   */
  async findPasswordChange(
    key: string,
    body: FindPasswordChangeDto,
    manager: EntityManager
  ): Promise<boolean> {
    const user = await this.userRepository.findUser(body.signname, manager);

    const verification = await this.verifyRepository.verifyMailKey(
      key,
      user.id,
      manager
    );
    user.password = await hash(body.password, 12);
    await this.updateUser(user.signname, user, manager);
    await this.verifyRepository.removeVerify(verification, manager);
    return true;
  }

  /**
   * 회원 탈퇴
   */
  async deleteUser(user: UserDto, manager: EntityManager): Promise<boolean> {
    await this.userRepository.findUserId(user.id, manager);
    await manager.update(
      Users,
      { signname: user.signname },
      {
        withdraw: true,
        withdraw_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      }
    );
    return true;
  }
}
