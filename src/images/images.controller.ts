import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { Post, Get, Body } from '@nestjs/common';
import { Image } from './image.entity';

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
