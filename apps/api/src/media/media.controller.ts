import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { MediaService } from './media.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':mediaId')
  async getFile(
    @Param('mediaId', new ParseIntPipe()) mediaId: number,
    @Res() res: Response,
  ) {
    try {
      const { file, mimeType, filename } =
        await this.mediaService.download(mediaId);

      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      res.send(file);
    } catch (error) {
      throw new NotFoundException('Fichier non trouvé');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.mediaService.upload(file);
  }
}
