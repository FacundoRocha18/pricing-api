import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UUID } from 'crypto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { Report } from './report.entity';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('/find')
  findReport(@Query('id') id: UUID): Promise<Report> {
    return this.service.findOne(id);
  }

  @Get('/find')
  findReportByCarName(@Query('name') name: string): Promise<Report[]> {
    return this.service.findByName(name);
  }

  @Get('/list')
  async listReports(
    @Query('max') max: number,
    @Query('offset') offset: number,
  ): Promise<Report[]> {
    return await this.service.listAll(max, offset);
  }

  @Get('/listBy')
  async listReportsByCarName(
    @Query('max') max: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
  ): Promise<Report[]> {
    return await this.service.listByName(max, offset, name);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getEstimateValue(@Query() query: GetEstimateDto): Promise<number> {
    return await this.service.createEstimate(query);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return this.service.create(body, user);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Patch('/approve')
  approveReport(
    @Query('id') id: UUID,
    @Body() body: ApproveReportDto,
  ): Promise<Report> {
    return this.service.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Patch('/update')
  updateReport(
    @Query('id') id: UUID,
    @Body() body: CreateReportDto,
  ): Promise<Report> {
    return this.service.update(id, body);
  }
}
