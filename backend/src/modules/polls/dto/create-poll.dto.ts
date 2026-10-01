import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePollDto {
  @ApiProperty({ example: 'Weekly sync' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: ['Asia/Tokyo', 'America/New_York'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  timezones: string[];

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes?: number;

  @ApiProperty({ example: ['2026-10-03T06:00:00.000Z'], description: 'Candidate start times (UTC ISO 8601)' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsISO8601({ strict: true }, { each: true })
  options: string[];
}
