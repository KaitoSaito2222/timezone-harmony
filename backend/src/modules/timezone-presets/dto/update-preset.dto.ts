import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimezoneItemDto } from './timezone-item.dto';

export class UpdatePresetDto {
  @ApiProperty({ example: 'My Work Preset', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Timezones for work meetings', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({ type: [TimezoneItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimezoneItemDto)
  timezones?: TimezoneItemDto[];
}
