import { Column, Project, Task } from '@prisma/client';
import { ProjectDetailWithTasks } from '@repo/shared-types';
import { ColumnDto } from '../columns/column.dto';
import { TaskDto } from '../tasks/task.dto';

export class ProjectDetailWithTasksDto implements ProjectDetailWithTasks {
  customerId: number;
  mediaId: number;
  name: string;
  columns: ColumnDto[];
  id: number;
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
                  }) as TaskDto,
              ),
          }) as ColumnDto,
      ),
  };
}
