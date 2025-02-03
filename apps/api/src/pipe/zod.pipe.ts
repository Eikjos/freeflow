import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodObject<any>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    this.schema.parse(value);
    return value;
  }
}
