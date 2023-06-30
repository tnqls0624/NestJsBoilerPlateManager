import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {korTimeAdd} from 'src/utils/kor-set';
import {RESULT_CODE} from '../../constant';
import {ResponseBodyType} from '../../types';
import CustomError from './custom-error';

export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof CustomError) {
      this.logger.error(
        `${exception.message}${
          exception.data ? `\n\r${JSON.stringify(exception.data)}` : ''
        }`,
        exception.stack,
        exception.context || this.constructor.name
      );
    } else if (
      exception instanceof HttpException ||
      exception instanceof Error
    ) {
      this.logger.error(exception.message, exception.stack);
    }

    const {httpAdapter} = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let code: number, statusCode: number, message: string;
    if (exception instanceof CustomError) {
      code = exception.code;
      statusCode = exception.status;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      code = RESULT_CODE.UNKNOWN_ERROR;
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      code = RESULT_CODE.UNKNOWN_ERROR;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception instanceof Error ? exception.message : '';
    }

    const responseBody: ResponseBodyType = {
      code,
      statusCode,
      timestamp: korTimeAdd('h', 0),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
