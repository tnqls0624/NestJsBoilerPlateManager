import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, Injectable } from "@nestjs/common";
import { Payload } from "@auth/service/jwt.payload";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@auth/service/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_ACCESS_TOKEN_SECRET"),
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload) {
    const { signname, method, password } = payload;
    const user = this.authService.validateUser(signname, password);
    if (user) {
      return user; // request.user
    } else {
      throw new HttpException("No Access", 401);
    }
  }
}
