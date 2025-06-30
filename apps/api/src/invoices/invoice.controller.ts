import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEnterpriseDto } from 'src/dtos/enterprises/enterprise-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import InvoiceService from './invoice.service';

@Controller('invoices')
@ApiTags('Invoices')
@ApiBearerAuth()
export default class InvoiceController {
  constructor(readonly invoiceService: InvoiceService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('invoice'))
  async create(
    @Body() body: CreateEnterpriseDto,
    @UploadedFile()
    logo: Express.Multer.File,
    @Req() req: Request,
  ) {}
}
