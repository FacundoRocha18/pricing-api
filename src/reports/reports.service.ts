import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repository: Repository<Report>,
  ) {}

  async findOne(id: UUID): Promise<Report> {
    const report = this.repository.findOneBy({ id });

    if (!report) {
      throw new NotFoundException('No se encontró el reporte');
    }

    return report;
  }

  async listAll(): Promise<Report[]> {
    const reports = await this.repository.find();

    if (reports.length < 0) {
      throw new NotFoundException('No se encuentran reportes guardados');
    }

    return reports;
  }

  async create(body: CreateReportDto): Promise<Report> {
    const report = this.repository.create(body);

    return this.repository.save(report);
  }
}
