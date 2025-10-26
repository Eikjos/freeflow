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
import { CreateEnterpriseDto } from 'src/dtos/enterprises/enterprise-create.dto';
import { EnterpriseInformationDto } from 'src/dtos/enterprises/enterprise-information.dto';
import EnterpriseUpdateDto from 'src/dtos/enterprises/enterprise-update.dto';
import { PaginationFilterDto } from 'src/dtos/utils/pagination-result.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ProjectService from 'src/projects/project.service';
import EnterpriseService from './enterprise.service';

@Controller('enterprises')
@ApiTags('Enterprise')
@ApiBearerAuth()
export default class EnterprisesController {
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly projectService: ProjectService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('information')
  async getInformation(
    @Query('siret') siret: string,
  ): Promise<Omit<EnterpriseInformationDto, 'id'>> {
    return await this.enterpriseService.getInformationBySiret(siret);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: 'Créer une entreprise avec un fichier (logo)',
    type: CreateEnterpriseDto,
  })
  @UseInterceptors(FileInterceptor('logo'))
  async createEnterprise(
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

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async finfById(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/projects')
  async getProjectsByEnterpriseId(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: PaginationFilterDto<Project>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'] as number;
    if (id !== enterpriseId) throw new ForbiddenException();
    return this.projectService.findAllByEnterpriseId(enterpriseId, filter);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/get-information-for-invoice')
  async getInformationForInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.getInformationForInvoice(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/get-information-for-devis')
  async getInformationForDevis(@Param('id', ParseIntPipe) id: number) {
    return this.enterpriseService.getInformationForDevis(id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: "Mettre à jour l'entreprise avec un fichier (logo)",
    type: EnterpriseUpdateDto,
  })
  @UseInterceptors(FileInterceptor('logo'))
  async update(
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

  @UseGuards(AccessTokenGuard)
  @Get('inscription-year')
  async getInscriptionYear(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.enterpriseService.getInscriptionYear(enterpriseId);
  }
}
