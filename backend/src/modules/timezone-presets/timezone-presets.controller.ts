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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimezonePresetsService } from './timezone-presets.service';

class CreatePresetDto {
  name: string;
  description?: string;
  isFavorite?: boolean;
  timezones: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

class UpdatePresetDto {
  name?: string;
  description?: string;
  isFavorite?: boolean;
  timezones?: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

@Controller('presets')
@UseGuards(JwtAuthGuard)
export class TimezonePresetsController {
  constructor(private readonly presetsService: TimezonePresetsService) {}

  @Get()
  findAll(@Request() req) {
    return this.presetsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.presetsService.findById(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreatePresetDto, @Request() req) {
    return this.presetsService.create(req.user.userId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePresetDto, @Request() req) {
    return this.presetsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.presetsService.delete(id, req.user.userId);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.presetsService.toggleFavorite(id, req.user.userId);
  }
}
