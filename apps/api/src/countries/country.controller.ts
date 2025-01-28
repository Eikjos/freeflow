import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get(':id')
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    const country = await this.countryService.findById(id);
    return country;
  }
}
