import {Controller, Get, Logger} from '@nestjs/common';
import {AppService} from './app.service';
import {SqsMessageHandler} from '@ssut/nestjs-sqs';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
