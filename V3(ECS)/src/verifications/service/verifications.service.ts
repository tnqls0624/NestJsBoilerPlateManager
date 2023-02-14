import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestMailDto } from 'src/verifications/dto/requestMail.dto';
import { customAlphabet } from 'nanoid';
import { VerificationsRepository } from '../infra/verifications.repository';
import { VerificationTypeEnum } from '../domain/entity/verifications.entity';
import { VerifyMailDto } from '../dto/verifyMail.dto';
import { UserRepository } from 'src/user/infra/user.repository';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class VerificationsService {
  constructor(
    private readonly connection: Connection,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly varificationsRepository: VerificationsRepository,
    private readonly userRepository: UserRepository,
  ) {}
  private static readonly logger = new Logger('verification');
  private generateToken = () => {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 10)();
    return nanoid;
  };

  private generateRandom = () => {
    const ranNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    return String(ranNum);
  };

  async requestMail(type: VerificationTypeEnum, body: RequestMailDto) {
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    try {
      const { to } = body;

      const token: string = this.generateToken();
      const key: string = this.generateRandom();
      const user = await this.userRepository.findUserforEmail(
        to,
        queryRunner.manager,
      );
      await this.mailerService
        .sendMail({
          to, // List of receivers email address
          from: `${this.config.get('EMAIL_ID')}@naver.com`, // Senders email address
          subject: 'Testing Nest Mailermodule with template ✔',
          template:
            type === VerificationTypeEnum.MAIL
              ? 'index'
              : type === VerificationTypeEnum.PASSWORD
              ? 'index'
              : 'findSignname', // The `.pug` or `.hbs` extension is appended automatically.
          context:
            type === VerificationTypeEnum.MAIL
              ? { code: key, name: user.name }
              : type === VerificationTypeEnum.PASSWORD
              ? { code: key, name: user.name }
              : { name: user.name, signname: user.signname },
        })
        .then(async (success) => {
          VerificationsService.logger.log(success);
        })
        .catch((err) => {
          VerificationsService.logger.error(err);
        });
      const args = {
        type:
          type === VerificationTypeEnum.MAIL
            ? VerificationTypeEnum.MAIL
            : type === VerificationTypeEnum.PASSWORD
            ? VerificationTypeEnum.PASSWORD
            : VerificationTypeEnum.SIGNNAME,
        user_id: user.id,
        to,
        token,
        key,
      };
      const resToken = await this.varificationsRepository.requestMail(
        args,
        queryRunner.manager,
      );
      const result =
        type === VerificationTypeEnum.MAIL //메일 인증
          ? {
              token: resToken,
            }
          : type === VerificationTypeEnum.PASSWORD //비밀번호 찾기
          ? true
          : true; // 나머지
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      VerificationsService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async verifyMail(body: VerifyMailDto) {
    const queryRunner: QueryRunner =
      this.connection.createQueryRunner('master');
    await queryRunner.connect();
    try {
      const { token, key } = body;
      if (!token) throw new HttpException('token is required', 400);
      if (!key) throw new HttpException('key is required', 400);
      const varification =
        await this.varificationsRepository.verifyMailTokenAndKey(
          token,
          key,
          queryRunner.manager,
        );
      await this.varificationsRepository.updateVerify(varification);
      await this.varificationsRepository.removeVerify(varification);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      VerificationsService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
