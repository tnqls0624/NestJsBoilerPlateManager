import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "@common/decorators/user.decorator";
import { ResponseDto } from "@common/responseDto/response.dto";
import { UndefinedToNullInterceptor } from "@interceptors/undefinedToNull.interceptor";
import { JoinUserDto } from "@auth/dto/action/joinUser.dto";
import { LoginUserDto } from "@auth/dto/action/loginUser.dto";
import { UpdateUserDto } from "@auth/dto/action/updateUser.dto";
import { UserDto } from "@user/dto/user/user.dto";
import { AuthService } from "@auth/service/auth.service";
import { JwtAuthGuard } from "@auth/service/guard";
import { FindPasswordChangeDto } from "@auth/dto/action/findPasswordChange.dto";
import { PasswordChangeDto } from "@auth/dto/action/passwordChange.dto";

@ApiTags("AUTH")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "회원가입" })
  @Post("/register")
  createUser(@Body() body: JoinUserDto) {
    return this.authService.createUser(body);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "로그인" })
  @Post("/login")
  loginUser(@Body() body: LoginUserDto) {
    return this.authService.loginUser(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "로그인 비밀번호 변경" })
  @Post("/password")
  changePassword(@User() user: UserDto, @Body() body: PasswordChangeDto) {
    return this.authService.changePassword(user, body);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "비밀번호 찾기 변경" })
  @ApiParam({
    name: "key",
    required: true,
    description: "인증번호",
    type: "string",
  })
  @Post("/find-password/:key")
  findPasswordChange(
    @Param("key") key: string,
    @Body() body: FindPasswordChangeDto
  ) {
    return this.authService.findPasswordChange(key, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "로그인 정보 조회" })
  @Get("/login")
  getLoginUser(@User() user: UserDto) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "회원정보 수정" })
  @Put("/login")
  updateUser(@User() user: UserDto, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(user.signname, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "회원 탈퇴" })
  @Delete("/login")
  deleteUser(@User() user: UserDto) {
    return this.authService.deleteUser(user);
  }
}
