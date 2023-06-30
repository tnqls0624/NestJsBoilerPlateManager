// import {PipeTransform, Injectable} from '@nestjs/common';
// import moment from 'moment-timezone';
// import CustomError from 'src/common/error/custom-error';
// import {RESULT_CODE} from 'src/constant';

// @Injectable()
// export class ParseDatePipe implements PipeTransform<string> {
//   transform(value: any): Date {
//     if (!moment(value, true).isValid())
//       throw new CustomError(RESULT_CODE.INVALID_REQUEST_DATE, {
//         context: this.constructor.name,
//         data: {request_date: value},
//       });
//     return moment(value, true).toDate();
//   }
// }
