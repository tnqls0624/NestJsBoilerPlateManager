import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/service/guard";
import { ResponseDto } from "@common/responseDto/response.dto";
import { UpdateSettingDto } from "@setting/dto/update.setting.dto";
import { SettingService } from "@setting/service/setting.service";

@ApiTags("Setting")
@Controller("setting")
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "세팅값 조회" })
  @Get("/")
  async findSetting() {
    const result = await this.settingService.findSetting();
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "세팅값 수정" })
  @Put("/")
  async updateSetting(@Body() body: UpdateSettingDto) {
    const result = await this.settingService.updateSetting(body);
    return result;
  }
}
