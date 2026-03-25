import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class ApiPublicGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const enterprise = await this.prisma.enterprise.findFirst({
      where: { apiPublicToken: token },
    });

    if (!enterprise) throw new ForbiddenException();
    request['enterpriseId'] = enterprise.id;
    return true;
  }

  extractTokenFromHeader(request: Request) {
    const token = request.headers['x-api-key'];
    return token;
  }
}
