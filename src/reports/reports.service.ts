import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

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
}
