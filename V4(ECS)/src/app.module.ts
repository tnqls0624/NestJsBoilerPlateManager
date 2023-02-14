import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { AppController } from "@app.controller";
import { AppService } from "@app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Joi from "joi";
import path from "path";
import appRoot from "app-root-path";
import { LoggerMiddleware } from "@middlewares/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@user/user.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { VerificationsModule } from "@verifications/verifications.module";
import { IpModule } from "@ip/ip.module";
import { ErrorsModule } from "@errors/errors.module";
import { Server } from "node:http";
import { HttpAdapterHost } from "@nestjs/core";
import { IpFilterMiddleware } from "@middlewares/ipfilter.middleware";
import { SettingModule } from "@setting/setting.module";
import { AuthModule } from "@auth/auth.module";
import { dataBaseConfig, joi, mailer } from "@dataBase.config";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.normalize(`${appRoot.path}/.env`),
      validationSchema: Joi.object(joi),
    }),
    TypeOrmModule.forRootAsync(dataBaseConfig),
    UserModule,
    AuthModule,
    MailerModule.forRootAsync(mailer),
    VerificationsModule,
    IpModule,
    ErrorsModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerMiddleware, Logger],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, IpFilterMiddleware).forRoutes("*");
  }
  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
  }
}
