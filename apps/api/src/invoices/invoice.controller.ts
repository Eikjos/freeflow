import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateInvoiceDto } from 'src/dtos/invoices/invoice-create.dto';
import { InvoiceFilterDataDto } from 'src/dtos/invoices/invoice-filter.dto';
import { PaginationFilterDto } from 'src/dtos/utils/pagination-result.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import InvoiceService from './invoice.service';

@Controller('invoices')
@ApiTags('Invoices')
@ApiBearerAuth()
export default class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('invoice'))
  @HttpCode(200)
  async create(
    @Body() body: CreateInvoiceDto,
    @UploadedFile()
    invoice: Express.Multer.File,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.invoiceService.createInvoice(body, invoice, enterpriseId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query() filter: PaginationFilterDto<InvoiceFilterDataDto>,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.invoiceService.findAll(filter, enterpriseId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.invoiceService.findById(id, enterpriseId);
  }
}
