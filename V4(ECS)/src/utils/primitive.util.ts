/* Array나 String, Number와 같은 primitive 자료형을 처리하는데 관련된 유틸 모음 */

export interface string_number {
  str: string;
  pos: number;
}

/* 문자열(string) 배열에서 특정 문자열이 나오는 원소까지 문자열을 누적시켜서 반환하는 함수 */
export const getConcatBy = (arr: string[], target: string, pos: number = 0): string_number => {
  const result: string_number = { str: arr[pos], pos: pos + 1 };
  for (; result.pos < arr.length && (!target || !arr[result.pos].includes(target)); ) {
    result.str += ' ' + arr[result.pos++];
  }
  return result;
};
