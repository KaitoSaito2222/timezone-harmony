import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Matches } from 'class-validator';
import { IsValidTimezone } from '../validators/is-valid-timezone.validator';

const TIME_FORMAT_REGEX = /^\d{2}:\d{2}$/;

export class TimezoneItemDto {
  @ApiProperty({ example: 'America/New_York' })
  @IsValidTimezone()
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
  @Matches(TIME_FORMAT_REGEX, {
    message: 'startTime must be in HH:mm format (e.g. "09:00")',
  })
  startTime?: string;

  @ApiProperty({ example: '18:00', required: false })
  @IsOptional()
  @Matches(TIME_FORMAT_REGEX, {
    message: 'endTime must be in HH:mm format (e.g. "18:00")',
  })
  endTime?: string;
}
