import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class PaginateParseIntPipe implements PipeTransform<string, number> {
  transform(value: any, metadata: ArgumentMetadata): number {
    value.page = parseInt(value.page);
    value.limit = parseInt(value.limit);
    return value;
  }
}
