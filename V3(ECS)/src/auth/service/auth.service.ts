import { HttpException, Injectable } from '@nestjs/common';
import bcrypt, { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from 'src/auth/dto/action/loginUser.dto';
import { ReissueTokenDto } from 'src/auth/dto/action/reissueToken.dto';
import { UserRepository } from 'src/user/infra/user.repository';
import { Users, UserTypeEnum } from 'src/user/domain/entity/user.entity';
import moment from 'moment';
import axios from 'axios';
import { AuthRepository } from '../infra/auth.repository';
import { UpdateUserDto } from 'src/auth/dto/action/updateUser.dto';
import { UserDto } from 'src/user/dto/user/user.dto';
import { PasswordChangeDto } from '../dto/action/passwordChange.dto';
import { FindPasswordChangeDto } from '../dto/action/findPasswordChange.dto copy';
import { JoinUserDto } from '../dto/action/joinUser.dto';
import { Connection, QueryRunner } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthService {
  constructor(
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(signname: string, password: string) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');

    await queryRunner.connect();
    try {
      const user = await this.usersRepository.findUser(
        signname,
        queryRunner.manager,
      );
      if (!user) {
        throw new HttpException('Not User', 400);
      }
      const bcryptPassWord = await bcrypt.compare(password, user.password);
      if (bcryptPassWord) {
        const { password, withdraw_at, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error: any) {
      console.log(error);
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
    const user = await this.validateUser(signname, password);
    if (!user) {
      throw new HttpException('유저가 존재하지 않습니다.', 400);
    }
    const accessToken = this.jwtService.sign(data, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const refreshToken = this.jwtService.sign(data, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const result = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  /**
   * 소셜 JWT
   */
  async socialLogIn(data: LoginUserDto) {
    const accessToken = this.jwtService.sign(data, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = this.jwtService.sign(data, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    const result = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  /**
   * User 토큰 재발급
   */
  async reissueToken(data: ReissueTokenDto) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner('slave');

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { refreshToken } = data;

      const decodedRefreshToken: any = this.jwtService.decode(
        refreshToken,
        this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      );
      const { password, ...userWithoutPassword } =
        await this.usersRepository.findUser(
          decodedRefreshToken.signname,
          queryRunner.manager,
        );
      if (!userWithoutPassword) {
        throw new HttpException('Not User', 400);
      }

      const accessToken = this.jwtService.sign(data, {
        secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      await queryRunner.commitTransaction();
      return accessToken;
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 회원가입
   */
  async createUser(body: JoinUserDto) {
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();

    try {
      const { signname, password, method } = body;
      const created_at = moment().toISOString();
      if (method === UserTypeEnum.KAKAO) {
        // 카카오 회원가입로직
        const { data: response } = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: {
              Authorization: `Bearer ${password}`,
            },
          },
        );
        body.signname = String(response.id) + `@${UserTypeEnum.KAKAO}`;
        body.password = await hash(signname + created_at, 10);
      } else if (method === UserTypeEnum.GOOGLE) {
        // 구글 회원가입로직
      } else if (method === UserTypeEnum.NAVER) {
        // 네이버 회원가입로직
        const {
          data: { response },
        } = await axios.get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `Bearer ${body.password}`,
          },
        });
        body.signname = String(response.id) + `@${UserTypeEnum.NAVER}`;
        body.password = await hash(signname + created_at, 10);
      } else {
        body.password = await bcrypt.hash(body.password, 12);
      }
      const args: any = {
        ...body,
        withdraw: 'false',
        verifymail: 'false',
      };
      const result = this.authRepository.createUser(args, queryRunner.manager);
      return result;
    } catch (error: any) {
      console.log(error);
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
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();

    try {
      const created_at = moment().toISOString();
      let refreshToken: string;
      let accessToken: string;

      if (body.method === UserTypeEnum.KAKAO) {
        // 카카오 로그인로직
        const { data: response } = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: {
              Authorization: `Bearer ${body.password}`,
            },
          },
        );
        body.signname = String(response.id) + `@${UserTypeEnum.KAKAO}`;

        const user = await this.usersRepository.findUser(
          body.signname,
          queryRunner.manager,
        );
        if (!user) {
          const joinData: any = {
            method: UserTypeEnum.KAKAO,
            signname: body.signname,
            password: body.password,
          };
          await this.createUser(joinData);
        }
        body.password = await hash(String(response.id) + created_at, 10);
        ({ refreshToken, accessToken } = await this.socialLogIn(body));
      } else if (body.method === UserTypeEnum.GOOGLE) {
        // 구글 로그인로직
        const client = new OAuth2Client(this.config.get('GOOGLE_CLIENT_KEY'));
        const ticket = await client.verifyIdToken({
          idToken: body.password,
          audience: this.config.get('GOOGLE_CLIENT_KEY'),
        });
        const payload = ticket.getPayload();
        if (!payload) throw new HttpException('invalid token', 400);
        const userid = payload.sub || '';
        body.signname = String(userid) + `@${UserTypeEnum.GOOGLE}`;
        const user = await this.usersRepository.findUser(
          body.signname,
          queryRunner.manager,
        );
        if (!user) {
          const joinData: any = {
            method: UserTypeEnum.KAKAO,
            signname: body.signname,
            password: body.password,
          };
          await this.createUser(joinData);
        }
        body.password = await hash(String(userid) + created_at, 10);
        ({ refreshToken, accessToken } = await this.socialLogIn(body));
      } else if (body.method === UserTypeEnum.NAVER) {
        // 네이버 로그인로직
        const {
          data: { response },
        } = await axios.get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `Bearer ${body.password}`,
          },
        });
        body.signname = String(response.id) + `@${UserTypeEnum.NAVER}`;

        const user = await this.usersRepository.findUser(
          body.signname,
          queryRunner.manager,
        );
        if (!user) {
          const joinData = {
            method: UserTypeEnum.NAVER,
            signname: body.signname,
            password: body.password,
            email: response.email,
            phone: response.mobile.replace(/\-/g, ''),
            name: response.name,
          };
          await this.createUser(joinData);
          // body.password = await hash(String(response.id) + created_at, 10);
          // user_id = user.id;
          // ({ refreshToken, accessToken } = await this.socialLogIn(body));
        }
        body.password = await hash(String(response.id) + created_at, 10);
        ({ refreshToken, accessToken } = await this.socialLogIn(body));
      } else {
        ({ refreshToken, accessToken } = await this.jwtLogIn(body));
      }
      await this.authRepository.loginUser(
        refreshToken,
        body.signname,
        queryRunner.manager,
      );

      const result = {
        accessToken,
        refreshToken,
      };
      await queryRunner.commitTransaction();
      return result;
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 정보 수정
   */
  async updateUser(signname: string, body: UpdateUserDto) {
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    try {
      const reuslt = await this.authRepository.updateUser(
        signname,
        body,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return reuslt;
    } catch (error: any) {
      console.log(error);
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
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reuslt = this.authRepository.changePassword(
        user,
        body,
        queryRunner.manager,
      );
      return reuslt;
    } catch (error: any) {
      console.log(error);
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
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reuslt = this.authRepository.findPasswordChange(
        key,
        body,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return reuslt;
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 탈퇴
   */
  async deleteUser(user: Users) {
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reuslt = this.authRepository.deleteUser(user, queryRunner.manager);
      await queryRunner.commitTransaction();
      return reuslt;
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 카카오 로그인
   */
  async kakaoCallback(req: any) {
    const {
      data: { access_token },
    } = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: this.config.get('KAKAO_REST_API'),
        redirect_uri: this.config.get('KAKAO_CALL_BACK'),
        code: req.query.code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const data: LoginUserDto = {
      method: UserTypeEnum.KAKAO,
      signname: 'KAKAO',
      password: access_token,
    };

    return await this.loginUser(data);
  }

  /**
   * 네이버 로그인
   */
  async naverCallback(req: any) {
    const {
      data: { access_token },
    } = await axios.post(
      'https://nid.naver.com/oauth2.0/token',
      {
        grant_type: 'authorization_code',
        client_id: this.config.get('NAVER_REST_API'),
        client_secret: this.config.get('NAVER_SECRET'),
        code: req.query.code,
        state: 'STATE_STRING',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const data: LoginUserDto = {
      method: UserTypeEnum.NAVER,
      signname: 'NAVER',
      password: access_token,
    };
    return await this.loginUser(data);
  }

  /**
   * 구글 로그인
   */
  async googleCallback(req: any) {
    const data: LoginUserDto = {
      method: UserTypeEnum.GOOGLE,
      signname: 'GOOGLE',
      password: req.idToken,
    };
    return await this.loginUser(data);
  }
}
