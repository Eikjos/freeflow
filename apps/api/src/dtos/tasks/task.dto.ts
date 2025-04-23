import { Task } from '@prisma/client';
import { TaskData } from '@repo/shared-types';

export class TaskDto implements TaskData {
  id: number;
  name: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  index: number;
  columnId: number;
  estimation?: number;
  mediaIds: number[];
}

export function mapToTask(task: Task, mediaIds: number[]): TaskDto {
  return { ...task, mediaIds };
}
