import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimezonePreset, PresetTimezone } from '@prisma/client';

interface CreatePresetDto {
  name: string;
  description?: string;
  isFavorite?: boolean;
  timezones: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

interface UpdatePresetDto {
  name?: string;
  description?: string;
  isFavorite?: boolean;
  timezones?: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

type PresetWithTimezones = TimezonePreset & { timezones: PresetTimezone[] };

@Injectable()
export class TimezonePresetsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<PresetWithTimezones[]> {
    return this.prisma.timezonePreset.findMany({
      where: { userId },
      include: { timezones: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<PresetWithTimezones> {
    const preset = await this.prisma.timezonePreset.findFirst({
      where: { id, userId },
      include: { timezones: true },
    });
    if (!preset) {
      throw new NotFoundException('Preset not found');
    }
    return preset;
  }

  async create(userId: string, dto: CreatePresetDto): Promise<PresetWithTimezones> {
    return this.prisma.timezonePreset.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        isFavorite: dto.isFavorite ?? false,
        timezones: {
          create: dto.timezones.map((tz, index) => ({
            timezoneIdentifier: tz.timezoneIdentifier,
            displayLabel: tz.displayLabel,
            position: tz.position ?? index,
          })),
        },
      },
      include: { timezones: true },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePresetDto,
  ): Promise<PresetWithTimezones> {
    await this.findById(id, userId);

    if (dto.timezones) {
      await this.prisma.presetTimezone.deleteMany({
        where: { presetId: id },
      });
    }

    return this.prisma.timezonePreset.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isFavorite !== undefined && { isFavorite: dto.isFavorite }),
        ...(dto.timezones && {
          timezones: {
            create: dto.timezones.map((tz, index) => ({
              timezoneIdentifier: tz.timezoneIdentifier,
              displayLabel: tz.displayLabel,
              position: tz.position ?? index,
            })),
          },
        }),
      },
      include: { timezones: true },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.timezonePreset.delete({
      where: { id },
    });
  }

  async toggleFavorite(id: string, userId: string): Promise<PresetWithTimezones> {
    const preset = await this.findById(id, userId);
    return this.prisma.timezonePreset.update({
      where: { id },
      data: { isFavorite: !preset.isFavorite },
      include: { timezones: true },
    });
  }
}
