import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Image])],
  controllers: [ReportsController],
  providers: [ReportsService, ImagesService],
})
export class ReportsModule {}
