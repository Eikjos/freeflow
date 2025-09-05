import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MediaService } from './media.service';

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

  // @UseGuards(AccessTokenGuard)
  // @Post()
  // @HttpCode(200)
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(
  //   @UploadedFile()
  //   file: Express.Multer.File,
  //   @Req() req: Request,
  // ) {
  //   const enterpriseId = req.user['enterpriseId'];
  //   return await this.mediaService.upload(file, parseInt(enterpriseId));
  // }
}
