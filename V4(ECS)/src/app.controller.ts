import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AppService } from "@app.service";
import { ResponseDto } from "@common/responseDto/response.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "테스트 웹훅" })
  @Post("test")
  getTest(@Body() body: any) {
    return body;
  }
}
