import { Body, Controller, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/responseDto/response.dto';
import { UndefinedToNullInterceptor } from 'src/interceptors/undefinedToNull.interceptor';
import { RequestMailDto } from 'src/verifications/dto/requestMail.dto';
import { VerificationTypeEnum } from '../domain/entity/verifications.entity';
import { VerifyMailDto } from '../dto/verifyMail.dto';
import { VerificationsService } from '../service/verifications.service';

@ApiTags('VARIFICATIONS')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('varifications')
export class VerificationsController {
  constructor(private verificationsService: VerificationsService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이디 찾기, 비밀번호 찾기, 메일 인증 요청' })
  @ApiQuery({
    name: 'type',
    required: true,
    description: '타입',
    enum: VerificationTypeEnum,
  })
  @Post('/request')
  requestMail(
    @Query('type') type: VerificationTypeEnum,
    @Body() body: RequestMailDto,
  ) {
    return this.verificationsService.requestMail(type, body);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '메일 인증' })
  @Post('/mail')
  verifyMail(@Body() body: VerifyMailDto) {
    return this.verificationsService.verifyMail(body);
  }
}
