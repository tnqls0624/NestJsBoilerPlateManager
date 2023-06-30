import {PipeTransform, Injectable} from '@nestjs/common';

@Injectable()
export class PaginateParseIntPipe implements PipeTransform<string, number> {
  transform(value: any): number {
    value.page = parseInt(value?.page) || undefined;
    value.limit = parseInt(value.limit);
    value.cursor = parseInt(value?.cursor) || undefined;
    return value;
  }
}
