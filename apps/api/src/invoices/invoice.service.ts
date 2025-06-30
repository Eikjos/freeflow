import { PrismaService } from 'src/prisma.service';

export default class InvoiceService {
  constructor(readonly prisma: PrismaService) {}
}
