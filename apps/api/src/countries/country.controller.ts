import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CountryService from './country.service';

@Controller('countries')
@ApiTags('Country')
@ApiBearerAuth()
export default class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll() {
    return await this.countryService.findAll();
  }
}
