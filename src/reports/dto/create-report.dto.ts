import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  maker: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  year: number;

  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  kilometers: number;

  @IsNumber()
  @Min(1)
  price: number;
}
