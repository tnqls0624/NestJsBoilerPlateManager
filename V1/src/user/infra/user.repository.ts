import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/domain/entity/user.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  /**
   * 회원 정보 찾기
   */
  async findUser(signname: string): Promise<Users> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    try {
      const user = await this.userRepository.findOne({
        where: { signname, withdraw: false },
      });
      if (!user) {
        throw new HttpException('not user', 400);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 이메일 중복 확인
   */
  async checkDuplicatedEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
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
  async checkDuplicatedPhone(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
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
  async findUserId(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id, withdraw: false },
    });
    if (!user) {
      throw new HttpException('not user', 400);
    }
    return user;
  }

  /**
   * 이메일 중복 확인
   */
  async findUserforEmail(to: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { email: to, withdraw: false },
    });
    if (!user) {
      throw new HttpException('not user', 400);
    }
    return user;
  }

  /**
   * 회원 중복 확인
   */
  async duplicateUser(signname: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { signname, withdraw: false },
    });
    if (user) {
      throw new HttpException('duplicate user', 400);
    }
    return user;
  }
}
