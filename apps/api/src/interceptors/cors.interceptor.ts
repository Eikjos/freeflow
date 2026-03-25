import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  constructor(private readonly options: { origin?: string }) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    if (this.options.origin) {
      response.header('Access-Control-Allow-Origin', this.options.origin);
      response.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,OPTIONS',
      );
      response.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-API-KEY',
      );
    }

    return next.handle();
  }
}
