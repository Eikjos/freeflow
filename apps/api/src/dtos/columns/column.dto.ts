import { Column } from '@prisma/client';
import { ColumnsData, TaskData } from '@repo/shared-types';

export class ColumnDto implements ColumnsData {
  id: number;
  name: string;
  index: number;
  tasks: TaskData[];
}

export function mapToColumn(col: Column): ColumnDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { projectId, ...column } = col;
  return {
    ...column,
    tasks: [],
  };
}
