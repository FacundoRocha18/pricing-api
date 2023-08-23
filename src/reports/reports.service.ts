import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>,
    private readonly imagesService: ImagesService,
  ) {}

  async findOne(id: UUID): Promise<Report> {
    const reports = await this.repository.find({
      where: { id },
      relations: { user: true, images: true },
    });

    if (reports.length === 0) {
      throw new NotFoundException('No se encontró el reporte');
    }

    return reports[0];
  }

  async listAll(): Promise<Report[]> {
    const reports = await this.repository.find({
      relations: { user: true, images: true },
    });

    if (reports.length < 0) {
      throw new NotFoundException('No se encuentraron reportes guardados');
    }

    return reports;
  }

  async createEstimate({
    maker,
    model,
    lng,
    lat,
    year,
    kilometers,
  }: GetEstimateDto): Promise<number> {
    return await this.repository
      .createQueryBuilder('report')
      .select('AVG(price)', 'price')
      .where('maker = :maker', { maker })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(kilometers - :kilometers)', 'DESC')
      .setParameters({ kilometers })
      .groupBy('report.kilometers')
      .limit(3)
      .getRawOne();
  }

  async create(body: CreateReportDto, user: User): Promise<Report> {
    const report = this.repository.create({
      ...body,
      user,
    });

    const images = body.images;

    const result = await this.repository.save(report);

    images.map(({ filename, content }) =>
      this.imagesService.upload({ filename, content, report: report }),
    );

    return result;
  }

  async update(id: UUID, attrs: Partial<Report>): Promise<Report> {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException('No se encontró el reporte.');
    }

    Object.assign(report, attrs);

    return this.repository.save(report);
  }
}
