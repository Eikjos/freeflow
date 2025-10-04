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
import CreateExpenseDto from 'src/dtos/expenses/create-expense.dto';
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
    const entrepriseId = parseInt(request.user['enterpriseId']);
    return this.expenseService.create(model, expense, entrepriseId);
  }
}
