import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
  IsArray,
} from 'class-validator';
import { Image } from '../../images/image.entity';

export class CreateReportDto {
  @IsString()
  maker: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  year: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsLongitude()
  lng: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  kilometers: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @IsArray()
  images: Image[];
}
