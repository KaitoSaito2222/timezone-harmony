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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimezonePresetsService } from './timezone-presets.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import type { RequestWithUser } from '../../common/types/request-with-user.interface';

@ApiTags('presets')
@ApiBearerAuth()
@Controller('presets')
@UseGuards(JwtAuthGuard)
export class TimezonePresetsController {
  constructor(private readonly presetsService: TimezonePresetsService) {}

  @ApiOperation({ summary: 'Get all presets for the authenticated user' })
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.presetsService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Get a preset by ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.findById(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Create a new preset' })
  @Post()
  create(@Body() dto: CreatePresetDto, @Request() req: RequestWithUser) {
    return this.presetsService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Update a preset by ID' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePresetDto,
    @Request() req: RequestWithUser,
  ) {
    return this.presetsService.update(id, req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Delete a preset by ID' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.delete(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Toggle favorite status of a preset' })
  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.presetsService.toggleFavorite(id, req.user.userId);
  }
}
