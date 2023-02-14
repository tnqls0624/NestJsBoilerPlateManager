import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Users } from "@user/domain/entity/user.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class UserRepository {
  constructor() {}

  private static readonly logger = new Logger("user");

  /**
   * 회원 정보 찾기
   */
  async findUser(signname: string, manager: EntityManager): Promise<Users> {
    const user: Users = await manager.findOne(Users, {
      where: { signname, withdraw: false },
    });
    return user;
  }

  /**
   * 회원 정보 아이디로 찾기
   */
  async findUserId(id: number, manager: EntityManager): Promise<Users> {
    const user: Users = await manager.findOne(Users, {
      where: { id, withdraw: false },
    });
    return user;
  }

  /**
   * 이메일 중복 확인
   */
  async checkDuplicatedEmail(email: string, manager: EntityManager) {
    const user: Users = await manager.findOne(Users, {
      where: { email, withdraw: false },
    });
    return user;
  }

  /**
   * 회원 중복 확인
   */
  async duplicateUser(
    signname: string,
    manager: EntityManager
  ): Promise<Users> {
    const user: Users = await manager.findOne(Users, {
      where: { signname, withdraw: false },
    });
    return user;
  }

  /**
   * 이메일 중복 확인
   */
  async findUserforEmail(to: string, manager: EntityManager): Promise<Users> {
    const user: Users = await manager.findOne(Users, {
      where: { email: to, withdraw: false },
    });
    if (!user) {
      UserRepository.logger.error("존재하지 않는 유저입니다");
      throw new HttpException("not user", 400);
    }
    return user;
  }
}
