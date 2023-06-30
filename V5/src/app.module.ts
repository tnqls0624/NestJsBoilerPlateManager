import {Logger, Module, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import path from 'path';
import appRoot from 'app-root-path';
import {Server} from 'node:http';
import {HttpAdapterHost} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import * as AWS from 'aws-sdk';

// const {AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_REGION} = process.env;
// AWS.config.update({
//   region: AWS_REGION,
//   accessKeyId: AWS_ACCESS_KEY,
//   secretAccessKey: AWS_SECRET_KEY,
// });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.normalize(`${appRoot.path}/.env`),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
  }
}
