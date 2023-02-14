import { MailerService } from "@nestjs-modules/mailer";
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequestMailDto } from "@verifications/dto/requestMail.dto";
import { customAlphabet } from "nanoid";
import { VerificationsRepository } from "@verifications/infra/verifications.repository";
import { VerificationTypeEnum } from "@verifications/domain/entity/verifications.entity";
import { VerifyMailDto } from "@verifications/dto/verifyMailDto";
import { UserRepository } from "@user/infra/user.repository";
import { Users } from "@user/domain/entity/user.entity";
import { QueryRunner, DataSource } from "typeorm";

@Injectable()
export class VerificationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly verificationsRepository: VerificationsRepository,
    private readonly userRepository: UserRepository,
    @Inject(Logger) private readonly logger: LoggerService
  ) {}
  private static readonly logger = new Logger("varification");
  private generateToken = () => {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    return customAlphabet(alphabet, 10)();
  };

  private generateRandom = () => {
    const ranNum: number =
      Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    return String(ranNum);
  };

  async requestMail(type: VerificationTypeEnum, body: RequestMailDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { to } = body;
      const token: string = this.generateToken();
      const key: string = this.generateRandom();
      const user: Users = await this.userRepository.findUserforEmail(
        to,
        queryRunner.manager
      );
      await this.mailerService
        .sendMail({
          to, // List of receivers email address
          from: `${this.config.get("EMAIL_ID")}@naver.com`, // Senders email address
          subject: "오토차지 메일 안내 ✔",
          template:
            type === VerificationTypeEnum.MAIL
              ? "index"
              : type === VerificationTypeEnum.PASSWORD
              ? "index"
              : "findSignname", // The `.pug` or `.hbs` extension is appended automatically.
          context:
            type === VerificationTypeEnum.MAIL
              ? { code: key, name: user.name }
              : type === VerificationTypeEnum.PASSWORD
              ? { code: key, name: user.name }
              : { name: user.name, signname: user.signname },
        })
        .then(async (success) => {
          this.logger.log("success", success);
        })
        .catch((err) => {
          this.logger.error("error", err);
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
      const resToken: string = await this.verificationsRepository.requestMail(
        args,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      // 나머지
      return type === VerificationTypeEnum.MAIL //메일 인증
        ? {
            token: resToken,
          }
        : type === VerificationTypeEnum.PASSWORD //비밀번호 찾기
        ? true
        : true;
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
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { token, key } = body;
      if (!token) throw new HttpException("token is required", 400);
      if (!key) throw new HttpException("key is required", 400);
      const result = await this.verificationsRepository.verifyMail(
        body,
        queryRunner.manager
      );
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
}
