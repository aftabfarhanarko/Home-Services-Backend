import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Public } from '../auth/decorators/public.decorator';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('upload')
export class UploadController {
  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const randomName = Array(16)
            .fill(null)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is not supported');
    }
    
    // Build full image URL
    const host = process.env.APP_URL || 'https://api.rajseba.com';
    const url = `${host}/uploads/${file.filename}`;

    return {
      statusCode: HttpStatus.OK,
      message: 'File uploaded successfully',
      url,
      data: {
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url,
      },
    };
  }
}
