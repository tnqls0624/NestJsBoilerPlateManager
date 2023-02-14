import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { IpService } from 'src/ip/service/ip.service';
import requestIp from 'request-ip';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  constructor(
    private readonly ipService: IpService,
    private readonly config: ConfigService,
  ) {}
  async use(req: requestIp.Request, res: Response, next: NextFunction) {
    const loadBalancerIp = this.config.get('LoadBalancerIp');
    const result = requestIp.getClientIp(req) || '1';
    if (result.includes(loadBalancerIp)) {
      next();
    } else {
      const allowIps: string[] = (await this.ipService.allowIp()).map(
        (v) => v.address,
      );

      if (!allowIps.includes(result)) {
        throw new UnauthorizedException('invalid ip');
      }
      next();
    }
  }
}
