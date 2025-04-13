import { Column, Project, Task } from '@prisma/client';
import {
  ColumnsData,
  ProjectDetailWithTasks,
  TaskData,
} from '@repo/shared-types';

export class ProjectDetailWithTasksDto implements ProjectDetailWithTasks {
  customerId: number;
  mediaId: number;
  name: string;
  columns: ColumnDto[];
  id: number;
}

export class ColumnDto implements ColumnsData {
  id: number;
  name: string;
  index: number;
  tasks: TaskDto[];
}

export class TaskDto implements TaskData {
  id: number;
  name: string;
  description: string;
  priority: 'high';
  index: number;
}

export function mapProjectWithTasksAndColumns(
  project: Project,
  columns: Array<{ tasks: Task[] } & Column>,
): ProjectDetailWithTasksDto {
  return {
    ...project,
    columns: columns
      .sort((a, b) => a.index - b.index)
      .map(
        (c) =>
          ({
            id: c.id,
            name: c.name,
            index: c.index,
            tasks: c.tasks
              .sort((a, b) => a.index - b.index)
              .map(
                (t) =>
                  ({
                    ...t,
                    priority: 'high',
                  }) as TaskDto,
              ),
          }) as ColumnDto,
      ),
  };
}
