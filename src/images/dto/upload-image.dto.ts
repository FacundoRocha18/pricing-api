import { IsBase64, IsObject, IsString } from 'class-validator';
import { Report } from '../../reports/report.entity';

export class UploadImageDto {
  @IsString()
  filename: string;

  @IsString()
  @IsBase64()
  content: string;

  @IsObject()
  report: Report;
}
