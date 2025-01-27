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
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnterpriseInformationDto } from 'src/dtos/enterprises/enterprise-information.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import EnterpriseService from './enterprise.service';
import { CreateEnterpriseDto } from 'src/dtos/enterprises/enterprise-create.dto';
import { ZodPipe } from 'src/pipe/zod.pipe';
import { EnterpriseCreateValidation } from '@repo/shared-types';

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
  @HttpCode(200)
  async createEnterprise(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodPipe(EnterpriseCreateValidation)) model: CreateEnterpriseDto,
    @Req() req: Request,
  ) {
    return await this.enterpriseService.createEnterprise(
      model,
      file,
      parseInt(req.user['sub']),
    );
  }
}
