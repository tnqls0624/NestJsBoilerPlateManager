import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout, retry } from 'rxjs/operators';
import moment from 'moment';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      map((data: any) => ({
        success: true,
        data,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        throw new HttpException(err, 400);
      }),
      retry(2),
    );
  }
}
