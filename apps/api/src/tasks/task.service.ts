import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class TaskService {
  constructor(private readonly prisma: PrismaService) {}
}
