import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';
import { UUID, randomUUID } from 'crypto';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from '../report.entity';
import { NotFoundException } from '@nestjs/common';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsServiceMock: Partial<ReportsService>;
  let testReport: Report;

  beforeEach(async () => {
    const reports: Report[] = [];

    reportsServiceMock = {
      findOne: async (id: UUID): Promise<Report> => {
        const [filteredReport] = reports.filter((report) => report.id === id);

        return Promise.resolve(filteredReport);
      },
      listAll: async (): Promise<Report[]> => Promise.resolve(reports),
      create: (body: CreateReportDto): Promise<Report> => {
        const report: Report = {
          id: randomUUID(),
          ...body,
        };

        reports.push(report);

        return Promise.resolve(report);
      },
      update: async (id: UUID, data: Partial<Report>): Promise<Report> => {
        const report = await reportsServiceMock.findOne(id);

        if (!report) {
          throw new NotFoundException('No se encontró el usuario.');
        }

        Object.assign(report, data);

        return Promise.resolve(report);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: reportsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);

    testReport = await reportsServiceMock.create({
      maker: 'Honda',
      model: 'Civic',
      year: 1996,
      lng: 50.0,
      lat: 10.0,
      kilometers: 100000,
      price: 9000,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a report with given ID', async () => {
    const report = await reportsServiceMock.findOne(testReport.id);

    expect(report).toBeDefined();
    expect(report.id).toBe(testReport.id);
    expect(report).toEqual(testReport);
  });

  it('should return all reports', async () => {
    const reports = await reportsServiceMock.listAll();

    expect(reports).toBeDefined();
    expect(reports.length).toBeGreaterThan(0);
  });

  it('should create and return a new report', async () => {
    const report = await reportsServiceMock.create({
      maker: 'Mitsubishi',
      model: 'Eclipse',
      year: 1996,
      lng: 500.0,
      lat: 10.0,
      kilometers: 100000,
      price: 10000,
      user: randomUUID(),
    });

    expect(report).toBeDefined();
    expect(report.id).toBeDefined();
  });

  it('should update the report with the given ID', async () => {
    const newData = {
      maker: 'Mitsubishi',
      model: 'Eclipse',
      price: 10000,
    };

    const modifiedReport = await reportsServiceMock.update(
      testReport.id,
      newData,
    );

    expect(modifiedReport).toBeDefined();
    expect(modifiedReport.id).toBe(testReport.id);
    expect(modifiedReport).not.toEqual(testReport);
  });
});
