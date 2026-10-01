import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VotePollDto {
  @ApiProperty({ example: 'Kaito' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  voterName: string;

  @ApiProperty({ description: 'Option ids the voter is available for (may be empty)' })
  @IsArray()
  @ArrayMaxSize(10)
  @IsUUID('all', { each: true })
  optionIds: string[];
}
