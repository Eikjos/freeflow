import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import ProjectCreateDto from 'src/dtos/projects/project-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ProjectService from './project.service';

@Controller('projects')
@ApiBearerAuth()
export default class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: 'Créer un projet avec un fichier (logo)',
    type: ProjectCreateDto,
  })
  @UseInterceptors(FileInterceptor('media'))
  async createEnterprise(
    @Body() body: ProjectCreateDto,
    @Req() req: Request,
    @UploadedFile()
    media?: Express.Multer.File,
  ) {
    return this.projectService.create(
      body,
      parseInt(req.user['enterpriseId']),
      media,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    console.log(id);
    return this.projectService.findById(id, req.user['enterpriseId']);
  }
}
