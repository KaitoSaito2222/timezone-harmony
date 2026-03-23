import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';

// Derived from the query shape so Prisma guarantees items is always present.
type PresetWithTimezones = Prisma.TimezonePresetGetPayload<{
  include: { items: true };
}>;

// Reference date used for all business hours conversions (2000-01-01).
const DEFAULT_REF = { year: 2000, month: 1, day: 1 } as const;

/**
 * Convert "HH:mm" local time in the given timezone to a UTC Date object
 * using the fixed reference date 2000-01-01.
 */
function timeStringToUtcDate(timeStr: string, timezone: string): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  return DateTime.fromObject(
    { ...DEFAULT_REF, hour, minute },
    { zone: timezone },
  )
    .toUTC()
    .toJSDate();
}

/**
 * Convert a UTC Date (stored with reference date 2000-01-01) back to "HH:mm"
 * in the given timezone.
 */
function utcDateToTimeString(date: Date, timezone: string): string {
  return DateTime.fromJSDate(date, { zone: 'UTC' })
    .setZone(timezone)
    .toFormat('HH:mm');
}

/** Response shape with startTime/endTime as "HH:mm" strings instead of Date. */
export interface PresetItemResponse {
  id: string;
  presetId: string;
  timezoneIdentifier: string;
  displayLabel: string | null;
  position: number;
  startTime: string | null;
  endTime: string | null;
  createdAt: Date;
}

export interface PresetResponse {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: PresetItemResponse[];
}

function mapPreset(preset: PresetWithTimezones): PresetResponse {
  return {
    ...preset,
    items: preset.items.map((item) => ({
      ...item,
      startTime: item.startTime
        ? utcDateToTimeString(item.startTime, item.timezoneIdentifier)
        : null,
      endTime: item.endTime
        ? utcDateToTimeString(item.endTime, item.timezoneIdentifier)
        : null,
    })),
  };
}

@Injectable()
export class TimezonePresetsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<PresetResponse[]> {
    const presets = await this.prisma.timezonePreset.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return presets.map(mapPreset);
  }

  async findById(id: string, userId: string): Promise<PresetResponse> {
    const preset = await this.prisma.timezonePreset.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!preset) {
      throw new NotFoundException('Preset not found');
    }
    return mapPreset(preset);
  }

  async create(userId: string, dto: CreatePresetDto): Promise<PresetResponse> {
    if (!dto.timezones || !Array.isArray(dto.timezones)) {
      throw new BadRequestException('Timezones array is required');
    }

    const preset = await this.prisma.timezonePreset.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        isFavorite: dto.isFavorite ?? false,
        items: {
          create: dto.timezones.map((tz, index) => ({
            timezoneIdentifier: tz.timezoneIdentifier,
            displayLabel: tz.displayLabel,
            position: tz.position ?? index,
            startTime: tz.startTime
              ? timeStringToUtcDate(tz.startTime, tz.timezoneIdentifier)
              : undefined,
            endTime: tz.endTime
              ? timeStringToUtcDate(tz.endTime, tz.timezoneIdentifier)
              : undefined,
          })),
        },
      },
      include: { items: true },
    });
    return mapPreset(preset);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePresetDto,
  ): Promise<PresetResponse> {
    await this.findById(id, userId);

    if (dto.timezones) {
      await this.prisma.timezonePresetItem.deleteMany({
        where: { presetId: id },
      });
    }

    const preset = await this.prisma.timezonePreset.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isFavorite !== undefined && { isFavorite: dto.isFavorite }),
        ...(dto.timezones && {
          items: {
            create: dto.timezones.map((tz, index) => ({
              timezoneIdentifier: tz.timezoneIdentifier,
              displayLabel: tz.displayLabel,
              position: tz.position ?? index,
              startTime: tz.startTime
                ? timeStringToUtcDate(tz.startTime, tz.timezoneIdentifier)
                : undefined,
              endTime: tz.endTime
                ? timeStringToUtcDate(tz.endTime, tz.timezoneIdentifier)
                : undefined,
            })),
          },
        }),
      },
      include: { items: true },
    });
    return mapPreset(preset);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.timezonePreset.delete({
      where: { id },
    });
  }

  async toggleFavorite(id: string, userId: string): Promise<PresetResponse> {
    const preset = await this.findById(id, userId);
    const updated = await this.prisma.timezonePreset.update({
      where: { id },
      data: { isFavorite: !preset.isFavorite },
      include: { items: true },
    });
    return mapPreset(updated);
  }
}
