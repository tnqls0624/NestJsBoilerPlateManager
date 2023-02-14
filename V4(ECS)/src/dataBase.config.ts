import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import Joi from "joi";

export const dataBaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    type: "mysql",
    replication: {
      master: {
        host: config.get("DB_WRITER"),
        port: config.get("DB_PORT"),
        username: config.get("DB_USERNAME"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_NAME"),
      },
      slaves: [
        {
          host: config.get("DB_READER"),
          port: config.get("DB_PORT"),
          username: config.get("DB_USERNAME"),
          password: config.get("DB_PASSWORD"),
          database: config.get("DB_NAME"),
        },
      ],
    },
    synchronize: true, // false로 해두는 게 안전 true로 할경우 실행시 테이블 새로 생성
    autoLoadEntities: true,
    charset: "utf8mb4",
    logging: false,
    keepConnectionAlive: true,
    timezone: "Z",
    poolSize: config.get("DB_POOL_SIZE"),
  }),
};

export const mailer = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    transport: {
      host: "smtp.naver.com",
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.get("EMAIL_ID"), // generated ethereal user
        pass: config.get("EMAIL_PASSWORD"), // generated ethereal password
      },
    },
    defaults: {
      from: `nest-modules <${config.get("EMAIL_ID")}@naver.com>`, // outgoing email ID
    },
    template: {
      dir: process.cwd() + "/src/template/",
      adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
  }),
};

export const joi = {
  JWT_SECRET: Joi.string().required(),
  DB_WRITER: Joi.string().required(),
  MODE: Joi.string().required(),
  DB_READER: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  EMAIL_ID: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  LoadBalancerIp: Joi.string().required(),
  DB_POOL_SIZE: Joi.string().required(),
};
