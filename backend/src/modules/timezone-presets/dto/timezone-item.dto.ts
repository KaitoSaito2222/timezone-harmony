import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class TimezoneItemDto {
  @ApiProperty({ example: 'America/New_York' })
  @IsString()
  timezoneIdentifier: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  displayLabel?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ example: '09:00', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ example: '18:00', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}
