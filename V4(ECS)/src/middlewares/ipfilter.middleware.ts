import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { IpService } from "@ip/service/ip.service";
import { ConfigService } from "@nestjs/config";
import { SettingService } from "@setting/service/setting.service";
import { FastifyRequest, FastifyReply } from "fastify";

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  constructor(
    private readonly ipService: IpService,
    private readonly settingService: SettingService,
    private readonly config: ConfigService
  ) {}

  private static readonly logger = new Logger("ip");
  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const loadBalancerIp = this.config.get("LoadBalancerIp");
    if (req.ip.includes(loadBalancerIp)) {
      next();
    } else {
      const setting = await this.settingService.findSetting();
      if (setting.isActive) {
        const allowIps: string[] = (await this.ipService.allowIp()).map(
          (v) => v.address
        );
        IpFilterMiddleware.logger.log(
          `URL : ${req.url} 요청 아이피 : ${req.ip}, Body : ${JSON.stringify(
            req.body
          )}, headers : ${JSON.stringify(req.headers)}`
        );
        if (!allowIps.includes(req.ip)) {
          IpFilterMiddleware.logger.log(
            `URL : ${req.url}  에러 아이피 : ${req.ip}, Body : ${JSON.stringify(
              req.body
            )}, headers : ${JSON.stringify(req.headers)}}`
          );
          throw new UnauthorizedException("invalid ip");
        }
      }
      next();
    }
  }
}
