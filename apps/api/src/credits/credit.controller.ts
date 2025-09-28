import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import CreateCreditDto from 'src/dtos/credits/create-credit.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import CreditService from './credit.service';

@Controller('credits')
export default class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('credit'))
  @HttpCode(200)
  async create(
    @Body() model: CreateCreditDto,
    @Req() req: Request,
    @UploadedFile()
    credit: Express.Multer.File,
  ) {
    const entrepriseId = parseInt(req.user['enterpriseId']);
    return this.creditService.create(model, entrepriseId, credit);
  }
}
