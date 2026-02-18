import { TaskData } from 'types/tasks';
import { z } from 'zod';

export type CreateColumnData = {
  name: string;
};

export type ColumnsData = {
  id: number;
  name: string;
  index: number;
  tasks: TaskData[];
};

export const CreateColumnValidation = z.object({
  name: z.string().min(1, 'The name is required'),
});

export type ReOrderColumsData = {
  orderedColumnIds: number[];
};
