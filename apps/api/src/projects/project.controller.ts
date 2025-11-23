import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import CreateColumnDto from 'src/dtos/columns/column-create.dto';
import ReorderColumnsDto from 'src/dtos/customers/reorder-colums.dto';
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
  @Get('count')
  async count(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.projectService.count(enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/columns')
  @HttpCode(200)
  async createColumn(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateColumnDto,
    @Req() req: Request,
  ) {
    return this.projectService.createColumn(
      id,
      parseInt(req.user['enterpriseId']),
      model,
    );
  }

  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Patch(':id/columns/reorder')
  async reorderColums(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: ReorderColumnsDto,
  ) {
    return this.projectService.reorderColumns(id, model.orderedColumnIds);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.projectService.findById(id, req.user['enterpriseId']);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/details')
  async findAllTasksByProjectId(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.projectService.findByIdWithTasksAndColumns(
      id,
      req.user['enterpriseId'],
    );
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('media'))
  @ApiBody({
    description: 'Mettre à un projet avec un fichier (logo)',
    type: ProjectCreateDto,
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: ProjectCreateDto,
    @Req() req: Request,
    @UploadedFile()
    media?: Express.Multer.File,
  ) {
    return this.projectService.update(
      id,
      model,
      parseInt(req.user['enterpriseId']),
      media,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.projectService.delete(id, parseInt(req.user['enterpriseId']));
  }
}
