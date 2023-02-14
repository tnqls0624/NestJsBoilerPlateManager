import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { RESULT_CODE } from "@constant";
import CustomError from "./CustomError";
import { ResponseBodyType } from "@types";

export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof CustomError) {
      this.logger.error(exception.message, exception.stack, exception.context);
    } else if (
      exception instanceof HttpException ||
      exception instanceof Error
    ) {
      this.logger.error(exception.message, exception.stack);
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let code: number,
      statusCode: number,
      message: string,
      data: any = {},
      logging: boolean = false;
    if (exception instanceof CustomError) {
      code = exception.code;
      statusCode = exception.status;
      message = exception.message;
      data = exception.data;
      logging = exception.logging;
    } else if (exception instanceof HttpException) {
      code = RESULT_CODE.UNKNOWN_ERROR;
      statusCode = exception.getStatus();
      message = exception.message;
      data = exception.getResponse();
    } else {
      code = RESULT_CODE.UNKNOWN_ERROR;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception instanceof Error ? exception.message : "";
    }

    const responseBody: ResponseBodyType = {
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
