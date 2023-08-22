import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { Post, Get, Body } from '@nestjs/common';
import { Image } from './image.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ImageDto } from './dto/image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @Get('/')
  async showImages(): Promise<Image[]> {
    return await this.service.list();
  }

  @Post('/upload')
  async uploadImage(@Body() data: UploadImageDto): Promise<Image> {
    return await this.service.upload(data);
  }
}
