import { Controller } from '@nestjs/common';
import ProjectService from './project.service';

@Controller('projects')
export default class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
}
