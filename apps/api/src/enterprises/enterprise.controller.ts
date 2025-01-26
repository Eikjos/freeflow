import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnterpriseInformationDto } from 'src/dtos/enterprises/enterprise-information.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
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
  async createEnterprise() {}
}
