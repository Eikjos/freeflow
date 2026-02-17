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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger'
import CreateColumnDto from 'dtos/columns/column-create.dto'
import ReorderColumnsDto from 'dtos/customers/reorder-colums.dto'
import ProjectCreateDto from 'dtos/projects/project-create.dto'
import { Request } from 'express'
import { AccessTokenGuard } from 'guards/access-token.guard'
import { CustomerGuard } from 'guards/customer.guard'
import { EnterpriseGuard } from 'guards/enterprise.guard'
import ProjectService from './project.service'

@Controller('projects')
@ApiBearerAuth()
export default class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(EnterpriseGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @ApiBody({
    description: 'Créer un projet avec un fichier (logo)',
    type: ProjectCreateDto,
  })
  @UseInterceptors(FileInterceptor('media'))
  create(
    @Body() body: ProjectCreateDto,
    @Req() req: Request,
    @UploadedFile()
    media?: Express.Multer.File,
  ) {
    return this.projectService.create(
      body,
      parseInt(req.user['enterpriseId']),
      media,
    )
  }

  @UseGuards(AccessTokenGuard)
  @Get('count')
  count(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId'])
    return this.projectService.count(enterpriseId)
  }

  @UseGuards(CustomerGuard, EnterpriseGuard)
  @Post(':id/columns')
  @HttpCode(200)
  createColumn(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateColumnDto,
    @Req() req: Request,
  ) {
    return this.projectService.createColumn(
      id,
      model,
      parseInt(req.user['enterpriseId']) || undefined,
      parseInt(req.user['customerId']) || undefined,
    )
  }

  @HttpCode(200)
  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Patch(':id/columns/reorder')
  reorderColums(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: ReorderColumnsDto,
  ) {
    return this.projectService.reorderColumns(id, model.orderedColumnIds)
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId']
    const customerId = req.user['customerId']
    return this.projectService.findById(id, enterpriseId, customerId)
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Get(':id/details')
  findAllTasksByProjectId(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.projectService.findByIdWithTasksAndColumns(
      id,
      req.user['enterpriseId'],
      req.user['customerId'],
    )
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @UseInterceptors(FileInterceptor('media'))
  @ApiBody({
    description: 'Mettre à un projet avec un fichier (logo)',
    type: ProjectCreateDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: ProjectCreateDto,
    @Req() req: Request,
    @UploadedFile()
    media?: Express.Multer.File,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId'])
    const customerId = parseInt(req.user['customerId'])
    return this.projectService.update(
      id,
      model,
      enterpriseId,
      customerId,
      media,
    )
  }

  @UseGuards(EnterpriseGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.projectService.delete(id, parseInt(req.user['enterpriseId']))
  }
}
