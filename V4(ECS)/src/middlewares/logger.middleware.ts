import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private static readonly logger = new Logger("log");

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, body, headers } = req;

    res.on("finish", () => {
      const { statusCode } = res;
      if (originalUrl !== "/") {
        LoggerMiddleware.logger.log(
          `method : ${method}, originalUrl : ${originalUrl}, statusCode : ${statusCode}, ip: ${ip}, content-type : ${
            headers["content-type"]
          }, body : ${JSON.stringify(body)}`
        );
      }
    });
    next();
  }
}
