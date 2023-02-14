import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from 'src/auth/service/guard';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseDto } from 'src/common/responseDto/response.dto';
import { UndefinedToNullInterceptor } from 'src/interceptors/undefinedToNull.interceptor';
import { Users } from 'src/user/domain/entity/user.entity';
import { CreateIpDto } from '../dto/action/createIp.dto';
import { UpdateIpDto } from '../dto/action/updateIp.dto';
import { IpService } from '../service/ip.service';
import requestIp from 'request-ip';

@ApiTags('IP')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '접속 가능 아이피 조회' })
  @Get('/access')
  accessIp(@Req() request: requestIp.Request) {
    return this.ipService.accessIp(request);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이피 생성' })
  @Post('/')
  createIp(@User() user: Users, @Body() body: CreateIpDto) {
    return this.ipService.createIp(user, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이피 수정' })
  @ApiParam({
    name: 'ipId',
    required: true,
    description: '아이피 아이디',
    type: 'string',
  })
  @Put('/:ipId')
  updateIp(
    @User() user: Users,
    @Param('ipId', ParseIntPipe) ipId: number,
    @Body() body: UpdateIpDto,
  ) {
    return this.ipService.updateIp(user, ipId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이피 삭제' })
  @ApiParam({
    name: 'ipId',
    required: true,
    description: '아이피 아이디',
    type: 'string',
  })
  @Delete('/:ipId')
  deleteIp(@User() user: Users, @Param('ipId', ParseIntPipe) ipId: number) {
    return this.ipService.deleteIp(user, ipId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이피 전체 조회' })
  @Get('/')
  findAllIp(@User() user: Users) {
    return this.ipService.findAllIp(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공',
  })
  @ApiOperation({ summary: '아이피 단일 조회' })
  @ApiParam({
    name: 'ipId',
    required: true,
    description: '아이피 아이디',
    type: 'string',
  })
  @Get('/:ipId')
  findIp(@User() user: Users, @Param('ipId', ParseIntPipe) ipId: number) {
    return this.ipService.findIp(user, ipId);
  }
}
