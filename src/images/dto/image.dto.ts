import { Expose, Transform } from 'class-transformer';
import { UUID } from 'crypto';

export class ImageDto {
  @Expose()
  filename: string;

  @Expose()
  content: string;

  @Transform(({ obj }) => obj.report.id)
  @Expose()
  reportId: UUID;
}
