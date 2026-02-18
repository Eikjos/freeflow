import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaDto } from 'dtos/media/media-dto';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  // - Methods
  async uploadBuffer(
    buffer: Buffer<ArrayBufferLike>,
    pathname: string,
    extension: string,
  ) {
    try {
      // Sauvegarder le fichier sur le serveur
      fs.writeFileSync(pathname, buffer);

      // Save in bdd
      const media = await this.prisma.media.create({
        data: {
          uploadedPath: pathname,
          extension: extension,
        },
      });

      return media.id;
    } catch {
      return -1;
    }
  }

  async upload(file: Express.Multer.File, pathname: string) {
    try {
      const extension = path.extname(file.originalname);
      const fileName = `${path.parse(file.originalname).name}-${Date.now()}${extension}`;
      const uploadPath = `uploads/${pathname}`;
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
          uploadedPath: filePath,
          extension: extension,
        },
      });

      return media.id;
    } catch {
      return -1;
    }
  }

  async download(id: number): Promise<MediaDto> {
    try {
      const media = await this.prisma.media.findFirstOrThrow({ where: { id } });
      const filePath = media.uploadedPath;

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('media.notFound');
      }

      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = this.getMimeType(media.extension);

      return {
        file: fileBuffer,
        mimeType,
        filename: this.getOriginalName(media.uploadedPath),
      };
    } catch {
      throw new NotFoundException('media.notFound');
    }
  }

  async delete(id: number) {
    const deleted = await this.prisma.media.delete({ where: { id } });
    if (!deleted) throw new HttpException('', HttpStatus.NO_CONTENT);
    const filePath = deleted.uploadedPath;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        throw new HttpException(err.message, HttpStatus.NOT_MODIFIED);
      }
    });
  }

  getUploadPath(extension: string) {
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
    const filename = storedFilename.split('/').reverse()[0];

    const dotIndex = storedFilename.lastIndexOf('.');
    const dashIndex = storedFilename.lastIndexOf('-');

    if (dotIndex === -1 || dashIndex === -1 || dashIndex > dotIndex) {
      return filename; // fallback si format inattendu
    }

    const base = filename.slice(0, dashIndex);
    const ext = filename.slice(dotIndex);
    return `${base}${ext}`;
  }
}
