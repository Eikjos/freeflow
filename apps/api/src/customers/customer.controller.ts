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
  async getStats(
    @Query('months', ParseIntPipe) months: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.getStats(enterpriseId, months);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query()
    filter: PaginationFilterDto<CustomerFilterDto>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findAll(enterpriseId, filter);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async create(@Body() model: CustomerCreateDto, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.create(enterpriseId, model);
  }

  @UseGuards(AccessTokenGuard)
  @Get('count')
  async count(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.count(enterpriseId);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CustomerCreateDto,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.update(
      id,
      model,
      enterpriseId ? parseInt(enterpriseId) : null,
    );
  }

  @Get(':id')
  @UseGuards(EnterpriseGuard, CustomerGuard)
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    const customerId = req.user['customerId'];
    if (enterpriseId) {
      return await this.customerService.findByIdAndEnterpriseId(
        id,
        enterpriseId,
      );
    }
    if (customerId == id) {
      return await this.customerService.findById(parseInt(customerId));
    }
    throw new ForbiddenException();
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.delete(id, enterpriseId);
  }

  @Post(':customerId/invite')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async inviteCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.invite(
      customerId,
      parseInt(enterpriseId),
    );
  }

  @Get(':customerId/projects')
  @UseGuards(CustomerGuard)
  async getProjectsByCustomerId(
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
  async getStatsByYear(
    @Param('year', ParseIntPipe) year: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.getStatsByYear(year, enterpriseId);
  }
}
