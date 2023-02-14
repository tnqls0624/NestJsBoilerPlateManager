import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestMailDto } from 'src/varifications/dto/requestMail.dto';
import { customAlphabet } from 'nanoid';
import { VarificationsRepository } from '../infra/varifications.repository';
import { VerificationTypeEnum } from '../domain/entity/varifications.entity';
import { VarifyMailDto } from '../dto/varifyMail.dto';
import { UserRepository } from 'src/user/infra/user.repository';

@Injectable()
export class VarificationsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly varificationsRepository: VarificationsRepository,
    private readonly userRepository: UserRepository,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  private generateToken = () => {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 10)();
    return nanoid;
  };

  // private generatePassword = () => {
  //   const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  //   const nanoid = customAlphabet(alphabet, 8)();
  //   return nanoid;
  // };

  private generateRandom = () => {
    const ranNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    return String(ranNum);
  };

  async requestMail(type: VerificationTypeEnum, body: RequestMailDto) {
    const { to } = body;

    const token: string = this.generateToken();
    const key: string = this.generateRandom();
    const user = await this.userRepository.findUserforEmail(to);
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
        this.logger.log(success);
      })
      .catch((err) => {
        this.logger.error(err);
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
    const resToken = await this.varificationsRepository.requestMail(args);
    const result =
      type === VerificationTypeEnum.MAIL //메일 인증
        ? {
            token: resToken,
          }
        : type === VerificationTypeEnum.PASSWORD //비밀번호 찾기
        ? true
        : true; // 나머지
    return result;
  }

  varifyMail(body: VarifyMailDto) {
    const { token, key } = body;
    if (!token) throw new HttpException('token is required', 400);
    if (!key) throw new HttpException('key is required', 400);

    return this.varificationsRepository.varifyMail(body);
  }
}
