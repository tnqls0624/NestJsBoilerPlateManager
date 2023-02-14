import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import path from 'path';
import appRoot from 'app-root-path';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Users } from './user/domain/entity/user.entity';
import { Auth } from './auth/domain/entity/auth.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { VarificationsModule } from './verifications/verifications.module';
import { Verification } from './verifications/domain/entity/verifications.entity';
import { Server } from 'node:http';
import { HttpAdapterHost } from '@nestjs/core';
import { IpFilterMiddleware } from './middlewares/ipfilter.middleware';
import { IpModule } from './ip/ip.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.normalize(`${appRoot.path}/.env`),
      validationSchema: Joi.object({
        MODE: Joi.string().valid('dev', 'prod').required(),
        JWT_SECRET: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Users, Auth, Verification], //entity
        synchronize: false, // false로 해두는 게 안전 true로 할경우 실행시 테이블 새로 생성
        autoLoadEntities: true,
        charset: 'utf8mb4',
        logging: true,
        keepConnectionAlive: true,
        timezone: 'Z',
        // poolSize: {
        //   max: 20,
        //   idle: 4800,
        //   acquire: 60000,
        // },
      }),
    }),
    UserModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.naver.com',
          port: 587,
          tls: {
            ciphers: 'SSLv3',
          },
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.get('EMAIL_ID'), // generated ethereal user
            pass: config.get('EMAIL_PASSWORD'), // generated ethereal password
          },
        },
        defaults: {
          from: `nest-modules <${config.get('EMAIL_ID')}@naver.com>`, // outgoing email ID
        },
        template: {
          dir: process.cwd() + '/src/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    VarificationsModule,
    IpModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerMiddleware, Logger],
})
export class AppModule implements NestModule {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, IpFilterMiddleware).forRoutes('*');
    //IpFilterMiddleware
  }
  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
  }
}
