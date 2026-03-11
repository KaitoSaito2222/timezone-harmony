import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TimezoneInfoDto {
  @ApiProperty({ example: 'America/New_York' })
  @IsString()
  timezone: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  @IsString()
  localTime: string;
}

export class ExportCalendarDto {
  @ApiProperty({ example: 'Team Sync' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'Weekly team meeting', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [TimezoneInfoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimezoneInfoDto)
  timezones?: TimezoneInfoDto[];
}
