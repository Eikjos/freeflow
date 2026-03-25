import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CorsRoute } from 'decorators/cors.decorator';
import OpinionDto from 'dtos/opinions/opinion.dto';
import { ApiPublicGuard } from 'guards/api-public.guard';
import OpinionService from './opinion.service';

@ApiTags('Public')
@Controller('api/public/opinions')
export default class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}

  @CorsRoute({ origin: '*' })
  @ApiSecurity('api-key')
  @UseGuards(ApiPublicGuard)
  @Get('top-5')
  @ApiOkResponse({
    type: OpinionDto,
    isArray: true,
  })
  getTop5(@Req() req: Request) {
    const enterpriseId = parseInt(req['enterpriseId']);
    return this.opinionService.getTop5(enterpriseId);
  }
}
