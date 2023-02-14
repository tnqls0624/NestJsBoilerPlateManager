import { HttpException, Injectable } from '@nestjs/common';
import { Users } from 'src/user/domain/entity/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserRepository {
  /**
   * 회원 정보 찾기
   */
  async findUser(signname: string, manager: EntityManager): Promise<Users> {
    const user = await manager.findOne(Users, {
      where: { signname, withdraw: false },
    });
    if (!user) {
      throw new HttpException('not user', 400);
    }
    return user;
  }

  /**
   * 이메일 중복 확인
   */
  async checkDuplicatedEmail(
    email: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const user = await manager.findOne(Users, {
      where: { email, withdraw: false },
    });
    if (user) {
      throw new HttpException('duplicate email', 400);
    }
    return true;
  }

  /**
   * 핸드폰 중복 확인
   */
  async checkDuplicatedPhone(
    email: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const user = await manager.findOne(Users, {
      where: { email, withdraw: false },
    });
    if (user) {
      throw new HttpException('duplicate email', 400);
    }
    return true;
  }

  /**
   * 회원 정보 아이디로 찾기
   */
  async findUserId(id: number, manager: EntityManager): Promise<Users> {
    try {
      const user = await manager.findOne(Users, {
        where: { id, withdraw: false },
      });
      if (!user) {
        throw new HttpException('not user', 400);
      }
      return user;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * 이메일 중복 확인
   */
  async findUserforEmail(to: string, manager: EntityManager): Promise<Users> {
    try {
      const user = await manager.findOne(Users, {
        where: { email: to, withdraw: false },
      });
      if (!user) {
        throw new HttpException('not user', 400);
      }
      return user;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  /**
   * 회원 중복 확인
   */
  async duplicateUser(signname: string, manager: EntityManager) {
    try {
      const user = await manager.findOne(Users, {
        where: { signname, withdraw: false },
      });
      if (user) {
        throw new HttpException('duplicate user', 400);
      }
      return user;
    } catch (error: any) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}
