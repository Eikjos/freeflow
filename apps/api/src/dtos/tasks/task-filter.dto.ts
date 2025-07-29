import { TaskFilter } from '@repo/shared-types';

export default class TaskFilterDto implements TaskFilter {
  name?: string;
  customerId?: number;
  [key: string]: string | number;
}
