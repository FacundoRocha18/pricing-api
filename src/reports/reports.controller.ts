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
//@UseGuards(AuthGuard)
@Serialize(ReportDto)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('/find')
  findReport(@Query('id') id: UUID): Promise<Report> {
    return this.service.findOne(id);
  }

  @Get('/list')
  async listReports(): Promise<Report[]> {
    return await this.service.listAll();
  }

  @Get()
  async getEstimateValue(@Query() query: GetEstimateDto): Promise<number> {
    return await this.service.createEstimate(query);
  }

  @Post('/create')
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return this.service.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/approve')
  approveReport(
    @Query('id') id: UUID,
    @Body() body: ApproveReportDto,
  ): Promise<Report> {
    return this.service.update(id, body);
  }

  @Patch('/update')
  updateReport(
    @Query('id') id: UUID,
    @Body() body: CreateReportDto,
  ): Promise<Report> {
    return this.service.update(id, body);
  }
}
