import { Controller } from '@nestjs/common';
import OpinionService from './opinion.service';

@Controller('opinions')
export default class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}
}
