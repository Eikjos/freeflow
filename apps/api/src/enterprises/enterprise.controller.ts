import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Request } from 'express';
import { EnterpriseOrCustomerGuard } from 'guards/enterprise-customer.guard';
import { EnterpriseGuard } from 'guards/enterprise.guard';
import NotificationService from 'notifications/notification.service';
import OpinionService from 'opinions/opinion.service';
import { CreateEnterpriseDto } from '../dtos/enterprises/enterprise-create.dto';
import { EnterpriseInformationDto } from '../dtos/enterprises/enterprise-information.dto';
import EnterpriseUpdateDto from '../dtos/enterprises/enterprise-update.dto';
import { PaginationFilterDto } from '../dtos/utils/pagination-result.dto';
import MailingService from '../mailing/mailing.service';
import ProjectService from '../projects/project.service';
import EnterpriseService from './enterprise.service';

@Controller('enterprises')
@ApiTags('Enterprise')
@ApiBearerAuth()
export default class EnterprisesController {
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly projectService: ProjectService,
    private readonly mailingService: MailingService,
    private readonly notificationService: NotificationService,
    private readonly opinionService: OpinionService,
  ) {}

  @UseGuards(EnterpriseGuard)
  @Get('stats')
  getStatsByYear(
    @Req() request: Request,
    @Query('year')
    year?: number,
  ) {
    const yearNumber = year ? parseInt(year as any, 10) : undefined;
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.enterpriseService.getStatsByYear(enterpriseId, yearNumber);
  }

  @UseGuards(EnterpriseOrCustomerGuard)
  @Get('information')
  getInformation(
    @Query('siret') siret: string,
  ): Promise<Omit<EnterpriseInformationDto, 'id'>> {
    return this.enterpriseService.getInformationBySiret(siret);
  }

  @UseGuards(EnterpriseGuard)
  @Get('inscription-year')
  getInscriptionYear(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.enterpriseService.getInscriptionYear(enterpriseId);
  }

  @UseGuards(EnterpriseGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: 'Créer une entreprise avec un fichier (logo)',
    type: CreateEnterpriseDto,
  })
  @UseInterceptors(FileInterceptor('logo'))
  createEnterprise(
    @Body() body: CreateEnterpriseDto,
    @UploadedFile()
    logo: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.enterpriseService.createEnterprise(
      body,
      logo,
      parseInt(req.user['sub']),
    );
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.findById(id);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/projects')
  getProjectsByEnterpriseId(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: PaginationFilterDto<Project>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'] as number;
    if (id !== enterpriseId) throw new ForbiddenException();
    return this.projectService.findAllByEnterpriseId(enterpriseId, filter);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/get-information-for-invoice')
  getInformationForInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.getInformationForInvoice(id);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/get-information-for-devis')
  getInformationForDevis(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.getInformationForDevis(id);
  }

  @UseGuards(EnterpriseGuard)
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: "Mettre à jour l'entreprise avec un fichier (logo)",
    type: EnterpriseUpdateDto,
  })
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() model: EnterpriseUpdateDto,
    @UploadedFile()
    logo?: Express.Multer.File,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    const userId = parseInt(req.user['sub']);
    return this.enterpriseService.update(id, model, enterpriseId, userId, logo);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/notifications')
  getNotificaitons(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.notificationService.findAllForEnterpriseId(enterpriseId);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/average-opinions-rate')
  getOptinionsAverageRate(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.opinionService.getRateAverage(enterpriseId);
  }

  @UseGuards(EnterpriseGuard)
  @Get(':id/opinions')
  getOpinions(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.opinionService.findAllByEnterprise(enterpriseId, false);
  }
}
