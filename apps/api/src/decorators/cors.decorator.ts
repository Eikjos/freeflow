import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CorsInterceptor } from 'interceptors/cors.interceptor';

export function CorsRoute(options: { origin?: string }) {
  return applyDecorators(UseInterceptors(new CorsInterceptor(options)));
}
