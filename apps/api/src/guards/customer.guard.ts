import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomerGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) throw new UnauthorizedException();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.isCustomer === 'false') {
      throw new ForbiddenException('Customer access only');
    }

    return true;
  }
}
