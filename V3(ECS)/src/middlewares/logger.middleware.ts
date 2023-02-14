import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, body, headers } = req;

    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${time} method : ${method}, originalUrl : ${originalUrl}, statusCode : ${statusCode}, ip: ${ip}, content-type : ${
          headers['content-type']
        }, body : ${JSON.stringify(body)}`,
      );
    });
    next();
  }
}
