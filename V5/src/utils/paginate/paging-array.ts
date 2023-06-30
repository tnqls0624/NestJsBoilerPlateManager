import {PageMetaDto} from './dto';

/**
 * 데이터 배열을 페이징 처리하는 함수
 * @param page 페이지 번호
 * @param limit 페이지당 데이터 개수
 * @param list 데이터 배열
 * @returns pageMetaDto - 페이징 정보 객체
 */
export function pagingArray(
  page: number,
  limit: number,
  list: unknown[]
): PageMetaDto {
  const pageMetaDto = new PageMetaDto({
    pageOptionsDto: {page, limit},
    itemCount: list.length,
  });

  const skip: number = limit * (page - 1);
  if (skip < list.length) {
    list.splice(0, skip); // page 이전의 모든 데이터 삭제
    list.splice(limit, list.length - limit); // page 이후 부분의 모든 데이터 삭제
  } else list.length = 0;

  return pageMetaDto;
}

export default {pagingArray};
