import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/service/guard";
import { ResponseDto } from "@common/responseDto/response.dto";
import { UndefinedToNullInterceptor } from "@interceptors/undefinedToNull.interceptor";
import { UserService } from "@user/service/user.service";
@ApiTags("USERS")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiQuery({
    name: "signname",
    required: true,
    description: "회원 signname",
    type: "string",
  })
  @ApiOperation({ summary: "signname 중복확인" })
  @Get("/check-duplicated-signname")
  checkDuplicatedSignname(@Query("signname") signname: string) {
    return this.userService.checkDuplicatedSignname(signname);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiQuery({
    name: "email",
    required: true,
    description: "회원 Email",
    type: "string",
  })
  @ApiOperation({ summary: "Email 중복확인" })
  @Get("/check-duplicated-email")
  checkDuplicatedEmail(@Query("email") email: string) {
    return this.userService.checkDuplicatedEmail(email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiParam({
    name: "signname",
    required: true,
    description: "회원 아이디",
    type: "string",
  })
  @ApiOperation({ summary: "회원정보 조회" })
  @Get("/:signname")
  findUser(@Param("signname") signname: string) {
    return this.userService.findUser(signname);
  }
}
