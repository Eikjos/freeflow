import {
  Body,
  Controller,
  Delete,
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
import { ApiConsumes } from '@nestjs/swagger';
import CreateExpenseDto from 'dtos/expenses/create-expense.dto';
import ExpenseFilterDto from 'dtos/expenses/expense-filter.dto';
import { ExpenseDto } from 'dtos/expenses/expense.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'dtos/utils/pagination-result.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import ExpenseService from './expense.service';

@Controller('expenses')
export default class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('expense'))
  async create(
    @Body() model: CreateExpenseDto,
    @UploadedFile() expense: Express.Multer.File,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.expenseService.create(model, expense, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query() filter: PaginationFilterDto<ExpenseFilterDto>,
    @Req() request: Request,
  ): Promise<PaginationResultDto<ExpenseDto>> {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.expenseService.findAll(enterpriseId, filter);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['entrepriseId'];
    return this.expenseService.delete(id, enterpriseId);
  }
}
