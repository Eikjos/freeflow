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
import { CreateInvoiceDto } from 'dtos/invoices/invoice-create.dto';
import { InvoiceFilterDataDto } from 'dtos/invoices/invoice-filter.dto';
import { PaginationFilterDto } from 'dtos/utils/pagination-result.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import { CustomerGuard } from 'guards/customer.guard';
import { EnterpriseGuard } from 'guards/enterprise.guard';
import InvoiceService from './invoice.service';

@Controller('invoices')
@ApiTags('Invoices')
@ApiBearerAuth()
export default class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @UseGuards(EnterpriseGuard)
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
  @UseGuards(EnterpriseGuard, CustomerGuard)
  async findAll(
    @Query() filter: PaginationFilterDto<InvoiceFilterDataDto>,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    const customerId = parseInt(req.user['customerId']);
    return this.invoiceService.findAll(filter, enterpriseId, customerId);
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
