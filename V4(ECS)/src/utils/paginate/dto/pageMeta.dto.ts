import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDtoParameters } from "@utils/paginate/interface/pageMetaDtoParameters";

export class PageMetaDto {
  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.currentPage = pageOptionsDto.page;
    this.itemsPerPage = pageOptionsDto.limit;
    this.totalItems = itemCount;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.hasPreviousPage = this.currentPage > 1;
    this.hasNextPage = this.currentPage < this.totalPages;
  }
  //page
  @ApiProperty()
  readonly currentPage: number;

  //take
  @ApiProperty()
  readonly itemsPerPage: number;

  @ApiProperty()
  readonly totalItems: number;

  //pageCount
  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;
}
