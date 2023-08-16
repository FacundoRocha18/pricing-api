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

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('/find')
  findReport(@Query('id') id: UUID) {
    return this.service.findOne(id);
  }

  @Get('/list')
  listReports() {
    return this.service.listAll();
  }

  @Get('/estimated')
  async getEstimateValue(@Query() query: GetEstimateDto) {
    const estimatedValue = await this.service.createEstimate(query);

    console.log(estimatedValue);

    return estimatedValue;
  }

  @Post('/create')
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.service.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/approve')
  approveReport(@Query('id') id: UUID, @Body() body: ApproveReportDto) {
    return this.service.update(id, body);
  }

  @Patch('/update')
  updateReport(@Query('id') id: UUID, @Body() body: CreateReportDto) {
    return this.service.update(id, body);
  }
}
