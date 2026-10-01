import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsUUID } from 'class-validator';

export class ClaimPollsDto {
  @ApiProperty({ description: 'Ids of polls created anonymously on this device' })
  @IsArray()
  @ArrayMaxSize(20)
  @IsUUID('all', { each: true })
  pollIds: string[];
}
