import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/service/guard";
import { User } from "@common/decorators/user.decorator";
import { ResponseDto } from "@common/responseDto/response.dto";
import { UndefinedToNullInterceptor } from "@interceptors/undefinedToNull.interceptor";
import { Users } from "@user/domain/entity/user.entity";
import { PaginateParseIntPipe } from "@utils/pipe/paginateParseInt.pipe";
import { ErrorsService } from "@errors/service/errors.service";
import { PageOptionsDto } from "@utils/paginate/dto/pageOptions.dto";

@ApiTags("ERRORS")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller("errors")
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: "성공",
  })
  @ApiOperation({ summary: "에러 현황 전체 조회" })
  @ApiQuery({
    name: "projectId",
    description: "프로젝트 아이디",
    type: "string",
    required: false,
  })
  @ApiQuery({
    name: "fromDate",
    description: "거래 기간",
    required: false,
  })
  @ApiQuery({
    name: "toDate",
    description: "거래 기간",
    required: false,
  })
  @Get("/")
  findAllErrors(
    @User() user: Users,
    @Query("projectId") projectId: number,
    @Query("fromDate") fromDate: string,
    @Query("toDate") toDate: string,
    @Query(new PaginateParseIntPipe()) PageOptionsDto: PageOptionsDto
  ) {
    return this.errorsService.findAllErrors(
      user.id,
      projectId,
      fromDate,
      toDate,
      PageOptionsDto
    );
  }
}
