import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Expose, Transform } from 'class-transformer';
import { Image } from '../../images/image.entity';

export class ReportDto {
  @Expose()
  id: UUID;

  @Expose()
  maker: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  kilometers: number;

  @Expose()
  price: number;

  @Expose()
  approved: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: UUID;

  @Expose()
  images: Image[];
}
