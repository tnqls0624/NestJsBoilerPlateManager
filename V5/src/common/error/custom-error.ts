import {RESULT_CODE_NAME} from '../../constant';

/**
 * CustomError
 * @param code
 * @param option
 * @param option.data
 * @param option.logging
 */
export default class CustomError extends Error {
  status: number;
  code: number;
  message: string;
  data?: any;
  context?: string;

  constructor(code: number, option: CustomErrorOption = {}) {
    /* 에러코드의 이름을 조회 */
    const codeName = RESULT_CODE_NAME[code] || 'UNKNOWN_ERROR';
    super(codeName);
    Error.captureStackTrace(this, CustomError);

    /* Custom Error 객체 수정 */
    this.code = code;
    this.message = codeName;
    this.data = option.data;
    this.status = option.status || 400;
    this.context = option.context;
  }
}

interface CustomErrorOption {
  status?: number;
  data?: any;
  context?: string;
}
