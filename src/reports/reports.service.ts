import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repository: Repository<Report>,
  ) {}

  async findOne(id: UUID): Promise<Report> {
    const report = await this.repository.findOneBy({ id });

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

  async create(body: CreateReportDto, user: User): Promise<Report> {
    const report = this.repository.create(body);

    report.user = user;

    return this.repository.save(report);
  }

  async update(id: UUID, attrs: Partial<Report>) {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException('No se encontró el reporte.');
    }

    Object.assign(report, attrs);

    return this.repository.save(report);
  }
}
