import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EnterpriseCreateValidation } from '@repo/shared-types';
import { Request } from 'express';
import { CreateEnterpriseDto } from 'src/dtos/enterprises/enterprise-create.dto';
import { EnterpriseInformationDto } from 'src/dtos/enterprises/enterprise-information.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ZodPipe } from 'src/pipe/zod.pipe';
import EnterpriseService from './enterprise.service';

@Controller('enterprises')
@ApiTags('Enterprise')
@ApiBearerAuth()
export default class EnterprisesController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

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
    @Body(new ZodPipe(EnterpriseCreateValidation)) body: CreateEnterpriseDto,
    @UploadedFile()
    logo: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.enterpriseService.createEnterprise(
      body,
      logo,
      parseInt(req.user['sub']),
    );
  }
}
