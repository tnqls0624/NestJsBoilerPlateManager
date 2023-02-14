import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  HttpException,
} from "@nestjs/common";
import { Observable, TimeoutError } from "rxjs";
import {
  catchError,
  map,
  timeout,
  retryWhen,
  scan,
  delay,
} from "rxjs/operators";
import moment from "moment";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      map((data: any) => ({
        success: true,
        data,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        throw new HttpException(err, 400);
      }),
      retryWhen((err) => {
        return err.pipe(
          scan((acc, error) => {
            if (acc === 1) throw error;
            return acc + 1;
          }, 0),
          delay(2000)
        );
      })
    );
  }
}
