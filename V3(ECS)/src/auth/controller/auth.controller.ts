import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseDto } from 'src/common/responseDto/response.dto';
import { UndefinedToNullInterceptor } from 'src/interceptors/undefinedToNull.interceptor';
import { JoinUserDto } from 'src/auth/dto/action/joinUser.dto';
import { LoginUserDto } from 'src/auth/dto/action/loginUser.dto';
import { ReissueTokenDto } from 'src/auth/dto/action/reissueToken.dto';
import { UpdateUserDto } from 'src/auth/dto/action/updateUser.dto';
import { UserDto } from 'src/user/dto/user/user.dto';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../service/guard';
import { FindPasswordChangeDto } from '../dto/action/findPasswordChange.dto copy';
import { PasswordChangeDto } from '../dto/action/passwordChange.dto';
import { Users } from 'src/user/domain/entity/user.entity';

@ApiTags('AUTH')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('/register')
  createUser(@Body() body: JoinUserDto) {
    return this.authService.createUser(body);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  loginUser(@Body() body: LoginUserDto) {
    return this.authService.loginUser(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '비밀번호 변경' })
  @Post('/password')
  changePassword(@User() user: UserDto, @Body() body: PasswordChangeDto) {
    return this.authService.changePassword(user, body);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiParam({
    name: 'key',
    required: true,
    description: '인증번호',
    type: 'string',
  })
  @Post('/find-password/:key')
  findPasswordChange(
    @Param('key') key: string,
    @Body() body: FindPasswordChangeDto,
  ) {
    return this.authService.findPasswordChange(key, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '로그인 정보 조회' })
  @Get('/login')
  getLoginUser(@User() user: UserDto) {
    return user;
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '토큰 재발급' })
  @Post('/refreshToken')
  reissueToken(@Body() body: ReissueTokenDto) {
    return this.authService.reissueToken(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '회원정보 수정' })
  @Put('/login')
  updateUser(@User() user: UserDto, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(user.signname, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete('/login')
  deleteUser(@User() user: Users) {
    return this.authService.deleteUser(user);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @Get('/kakao/callback')
  async kakaoCallback(@Req() req: Request) {
    return this.authService.kakaoCallback(req);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '구글 로그인 콜백' })
  @Get('/google/callback')
  async googleCallback(@Req() req: Request) {
    console.log(req);
    // return this.userService.googleCallback(req);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '네이버 로그인 콜백' })
  @Get('/naver/callback')
  async naverCallback(@Req() req: Request) {
    return this.authService.naverCallback(req);
  }
}
