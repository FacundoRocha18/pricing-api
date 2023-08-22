import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/upload-image.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly repository: Repository<Image>,
  ) {}

  async list(): Promise<Image[]> {
    return await this.repository.find();
  }

  async upload(imageData: UploadImageDto): Promise<Image> {
    const image = this.repository.create(imageData);

    return this.repository.save(image);
  }
}
