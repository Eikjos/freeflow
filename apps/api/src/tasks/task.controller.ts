import { Controller } from '@nestjs/common';
import TaskService from './task.service';

@Controller('/tasks')
export default class TasksController {
  constructor(private readonly taskService: TaskService) {}
}
