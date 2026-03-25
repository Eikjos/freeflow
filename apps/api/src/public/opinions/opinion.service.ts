import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApiAcceptedResponse } from '@nestjs/swagger';
import { mapForApiPublic } from 'dtos/opinions/opinion.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class OpinionService {
  constructor(private readonly prisma: PrismaService) {}

  @ApiAcceptedResponse({
    description: '200 - Les meilleures avis les plus récent',
  })
  async getTop5(enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    const opinions = await this.prisma.opinion.findMany({
      where: {
        enterpriseId,
      },
      include: { customer: true },
      orderBy: [{ rate: 'desc' }, { createdAt: 'desc' }],
      take: 5,
    });
    return opinions.map((o) => mapForApiPublic(o, o.customer));
  }
}
