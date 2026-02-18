import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import CustomerCreateDto from 'dtos/customers/customer-create.dto';
import { CustomerFilterDto } from 'dtos/customers/customer-filter.dto';
import { PaginationFilterDto } from 'dtos/utils/pagination-result.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import { CustomerGuard } from 'guards/customer.guard';
import { EnterpriseGuard } from 'guards/enterprise.guard';
import ProjectService from 'projects/project.service';
import CustomerService from './customer.service';

@Controller('customers')
@ApiBearerAuth()
export default class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('stats')
  @UseGuards(AccessTokenGuard)
  getStats(@Query('months', ParseIntPipe) months: number, @Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.customerService.getStats(enterpriseId, months);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(
    @Query()
    filter: PaginationFilterDto<CustomerFilterDto>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return this.customerService.findAll(enterpriseId, filter);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  create(@Body() model: CustomerCreateDto, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return this.customerService.create(enterpriseId, model);
  }

  @UseGuards(AccessTokenGuard)
  @Get('count')
  count(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.customerService.count(enterpriseId);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CustomerCreateDto,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return this.customerService.update(
      id,
      model,
      enterpriseId ? parseInt(enterpriseId) : null,
    );
  }

  @Get(':id')
  @UseGuards(EnterpriseGuard, CustomerGuard)
  findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    const customerId = req.user['customerId'];
    if (enterpriseId) {
      return this.customerService.findByIdAndEnterpriseId(id, enterpriseId);
    }
    if (customerId == id) {
      return this.customerService.findById(parseInt(customerId));
    }
    throw new ForbiddenException();
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return this.customerService.delete(id, enterpriseId);
  }

  @Post(':customerId/invite')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  inviteCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return this.customerService.invite(customerId, parseInt(enterpriseId));
  }

  @Get(':customerId/projects')
  @UseGuards(CustomerGuard)
  getProjectsByCustomerId(
    @Param('customerId', ParseIntPipe) id: number,
    @Query() filter: PaginationFilterDto<Project>,
    @Req() req: Request,
  ) {
    const customerId = req.user['customerId'] as number;
    if (id !== customerId) throw new ForbiddenException();
    return this.projectService.findAllByCustomerId(customerId, filter);
  }

  @Get(':year/stats')
  @UseGuards(AccessTokenGuard)
  getStatsByYear(
    @Param('year', ParseIntPipe) year: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.customerService.getStatsByYear(year, enterpriseId);
  }
}
