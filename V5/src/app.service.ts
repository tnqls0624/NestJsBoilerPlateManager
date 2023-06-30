import {Injectable} from '@nestjs/common';
@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return 'MiniScore Crawler server is running!';
  }
}
