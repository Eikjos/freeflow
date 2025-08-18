import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MediaDto } from 'src/dtos/media/media-dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  // - Methods
  async upload(file: Express.Multer.File, pathname?: string) {
    try {
      const extension = path.extname(file.originalname);
      const fileName = `${path.parse(file.originalname).name}-${Date.now()}${extension}`;
      const uploadPath = pathname
        ? `uploads/${pathname}`
        : this.getUploadPath(extension);
      const filePath = path.join(uploadPath, fileName);

      // Créez le dossier si nécessaire
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Sauvegarder le fichier sur le serveur
      fs.writeFileSync(filePath, file.buffer);

      // Save in bdd
      const media = await this.prisma.media.create({
        data: {
          filename: fileName,
          extension: extension,
        },
      });

      return media.id;
    } catch (e) {
      return -1;
    }
  }

  async download(id: number): Promise<MediaDto> {
    try {
      const media = await this.prisma.media.findFirstOrThrow({ where: { id } });
      const filePath = path.join(
        this.getUploadPath(path.extname(media.filename)),
        media.filename,
      );

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('media.notFound');
      }

      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = this.getMimeType(media.extension);

      return {
        file: fileBuffer,
        mimeType,
        filename: this.getOriginalName(media.filename),
      };
    } catch (e) {
      throw new NotFoundException('media.notFound');
    }
  }

  async delete(id: number) {
    const deleted = await this.prisma.media.delete({ where: { id } });
    if (!deleted) throw new HttpException('', HttpStatus.NO_CONTENT);
    const filePath = path.join(
      this.getUploadPath(deleted.extension),
      deleted.filename,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        throw new HttpException(err.message, HttpStatus.NOT_MODIFIED);
      }
    });
  }

  private getUploadPath(extension: string) {
    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      return 'uploads/images';
    } else if (extension === '.pdf') {
      return 'uploads/pdfs';
    } else {
      return 'uploads/others';
    }
  }

  private getMimeType(extension: string) {
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/jpeg';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream'; // Type générique pour les autres fichiers
    }
  }

  private getOriginalName(storedFilename: string) {
    const dotIndex = storedFilename.lastIndexOf('.');
    const dashIndex = storedFilename.lastIndexOf('-');

    if (dotIndex === -1 || dashIndex === -1 || dashIndex > dotIndex) {
      return storedFilename; // fallback si format inattendu
    }

    const base = storedFilename.slice(0, dashIndex);
    const ext = storedFilename.slice(dotIndex);
    return `${base}${ext}`;
  }
}
