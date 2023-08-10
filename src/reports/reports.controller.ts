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

  @Post('/create')
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.service.create(body, user);
  }

  @Patch('/update')
  updateReport(@Query('id') id: UUID, @Body() body: CreateReportDto) {
    return this.service.update(id, body);
  }
}
