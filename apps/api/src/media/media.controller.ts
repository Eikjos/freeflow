import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('mediaId')
  async getFile(
    @Param('mediaId', new ParseIntPipe()) mediaId: number,
    @Res() res: Response,
  ) {
    try {
      const { file, mimeType } = await this.mediaService.download(mediaId);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', 'inline');

      res.send(file);
    } catch (error) {
      throw new NotFoundException('Fichier non trouvé');
    }
  }
}
