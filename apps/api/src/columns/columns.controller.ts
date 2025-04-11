import { Controller } from '@nestjs/common';
import ColumnService from './columns.service';

@Controller('columns')
export default class ColumnsController {
  constructor(private readonly columnService: ColumnService) {}
}
