import { Task } from '@prisma/client';
import { TaskData } from '@repo/shared-types';

export class TaskDto implements TaskData {
  id: number;
  name: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  index: number;
}

export function mapToTask(task: Task): TaskDto {
  return { ...task };
}
