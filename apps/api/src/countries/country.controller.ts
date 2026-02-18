import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CountryService from './country.service';

@Controller('countries')
@ApiTags('Country')
@ApiBearerAuth()
export default class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.countryService.findById(id);
  }
}
