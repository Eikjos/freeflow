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
import QuoteValidateDto from 'dtos/invoices/quote-validate.dto';
import { PaginationFilterDto } from 'dtos/utils/pagination-result.dto';
import { Request } from 'express';
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
  @UseGuards(EnterpriseGuard, CustomerGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.invoiceService.findById(id, enterpriseId);
  }

  @Post(':id/send-validation')
  @UseGuards(CustomerGuard)
  @HttpCode(200)
  async sendValidationQuote(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const customerId = parseInt(req.user['customerId']);
    return this.invoiceService.sendCode(id, customerId);
  }

  @Post(':id/validate')
  @UseGuards(CustomerGuard)
  @HttpCode(200)
  async validteQuote(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: QuoteValidateDto,
    @Req() req: Request,
  ) {
    const customerId = parseInt(req.user['customerId']);
    const userId = parseInt(req.user['sub']);
    return this.invoiceService.validate(id, customerId, model, userId);
  }

  @Post(':id/pay')
  @UseGuards(CustomerGuard)
  @HttpCode(200)
  async payInvoice(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const customerId = parseInt(req.user['customerId']);
    return this.invoiceService.pay(id, customerId);
  }
}
