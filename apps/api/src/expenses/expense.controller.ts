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
import { Request } from 'express';
import CreateExpenseDto from 'src/dtos/expenses/create-expense.dto';
import ExpenseFilterDto from 'src/dtos/expenses/expense-filter.dto';
import { ExpenseDto } from 'src/dtos/expenses/expense.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'src/dtos/utils/pagination-result.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
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
    return await this.expenseService.delete(id, enterpriseId);
  }
}
