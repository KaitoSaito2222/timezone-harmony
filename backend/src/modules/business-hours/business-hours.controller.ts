import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessHoursService } from './business-hours.service';

class CreateBusinessHoursDto {
  timezoneIdentifier: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

class UpdateBusinessHoursDto {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

class BulkCreateBusinessHoursDto {
  timezoneIdentifier: string;
  hours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  }[];
}

@Controller('business-hours')
@UseGuards(JwtAuthGuard)
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Get()
  findAll(@Request() req, @Query('timezone') timezone?: string) {
    if (timezone) {
      return this.businessHoursService.findByTimezone(
        req.user.userId,
        decodeURIComponent(timezone),
      );
    }
    return this.businessHoursService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.businessHoursService.findById(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateBusinessHoursDto, @Request() req) {
    return this.businessHoursService.create(req.user.userId, dto);
  }

  @Post('bulk')
  bulkCreate(@Body() dto: BulkCreateBusinessHoursDto, @Request() req) {
    return this.businessHoursService.bulkCreate(req.user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessHoursDto,
    @Request() req,
  ) {
    return this.businessHoursService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.businessHoursService.delete(id, req.user.userId);
  }

  @Delete('timezone/:timezone')
  removeByTimezone(@Param('timezone') timezone: string, @Request() req) {
    return this.businessHoursService.deleteByTimezone(
      req.user.userId,
      decodeURIComponent(timezone),
    );
  }
}
