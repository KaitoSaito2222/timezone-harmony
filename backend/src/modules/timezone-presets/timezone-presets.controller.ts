import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimezonePresetsService } from './timezone-presets.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

class TimezoneItemDto {
  @IsString()
  timezoneIdentifier: string;

  @IsOptional()
  @IsString()
  displayLabel?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}

class CreatePresetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimezoneItemDto)
  timezones: TimezoneItemDto[];
}

class UpdatePresetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimezoneItemDto)
  timezones?: TimezoneItemDto[];
}

@Controller('presets')
@UseGuards(JwtAuthGuard)
export class TimezonePresetsController {
  constructor(private readonly presetsService: TimezonePresetsService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.presetsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.findById(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreatePresetDto, @Request() req: RequestWithUser) {
    return this.presetsService.create(req.user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePresetDto,
    @Request() req: RequestWithUser,
  ) {
    return this.presetsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.delete(id, req.user.userId);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.toggleFavorite(id, req.user.userId);
  }
}
