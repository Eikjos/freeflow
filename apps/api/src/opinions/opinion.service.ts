import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import CreateOpinionDto from 'dtos/opinions/create-opinion.dto';
import OpinionDto, { mapForApiPublic } from 'dtos/opinions/opinion.dto';
import MailingService from 'mailing/mailing.service';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class OpinionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailingService: MailingService,
  ) {}

  async findAllByEnterprise(enterpriseId: number, isPublic: boolean = false) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    const opinions = await this.prisma.opinion.findMany({
      where: { enterpriseId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    if (isPublic) {
      return opinions.map((o) => mapForApiPublic(o, o.customer));
    }
    return opinions.map((o) => new OpinionDto(o, o.customer));
  }

  async getRateAverage(enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    const data = await this.prisma.opinion.aggregate({
      _avg: { rate: true },
      where: { enterpriseId },
    });
    return data._avg.rate;
  }

  async create(
    model: CreateOpinionDto,
    customerId: number,
    enterpriseId: number,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId },
    });
    if (!customer) throw new ForbiddenException();
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise)
      throw new BadRequestException('opinion.enterprise.not-found');

    await this.prisma.opinion.create({
      data: {
        customerId,
        enterpriseId,
        content: model.content,
        rate: model.rate,
      },
    });
  }

  @Cron('0 12 * * *')
  async sendReviewsMails() {
    console.log("Début cron job pour envoyer les demandes d'avis");

    const date = new Date();
    date.setDate(date.getDate() - 30);
    const relations = await this.prisma.enterpriseCustomer.findMany({
      where: {
        emailReviewSent: false,
        createdAt: { lt: date },
        isDeleted: false,
      },
      include: { customer: true, enterprise: true },
    });

    for (const relation of relations) {
      await this.mailingService.sendReviewMail(
        relation.customer.email,
        relation.enterpriseId,
        relation.enterprise.name,
      );
      await this.prisma.enterpriseCustomer.update({
        where: {
          enterpriseId_customerId: {
            enterpriseId: relation.enterpriseId,
            customerId: relation.customerId,
          },
        },
        data: {
          emailReviewSent: true,
        },
      });
    }

    console.log("Fin cron job pour envoyer les demandes d'avis");
  }
}
