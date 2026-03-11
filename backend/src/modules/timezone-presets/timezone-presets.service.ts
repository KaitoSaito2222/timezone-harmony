import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';

// Derived from the query shape so Prisma guarantees items is always present.
type PresetWithTimezones = Prisma.TimezonePresetGetPayload<{
  include: { items: true };
}>;

@Injectable()
export class TimezonePresetsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<PresetWithTimezones[]> {
    return this.prisma.timezonePreset.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<PresetWithTimezones> {
    const preset = await this.prisma.timezonePreset.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!preset) {
      throw new NotFoundException('Preset not found');
    }
    return preset;
  }

  async create(
    userId: string,
    dto: CreatePresetDto,
  ): Promise<PresetWithTimezones> {
    if (!dto.timezones || !Array.isArray(dto.timezones)) {
      throw new BadRequestException('Timezones array is required');
    }

    return this.prisma.timezonePreset.create({
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
            startTime: tz.startTime,
            endTime: tz.endTime,
          })),
        },
      },
      include: { items: true },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePresetDto,
  ): Promise<PresetWithTimezones> {
    await this.findById(id, userId);

    if (dto.timezones) {
      await this.prisma.timezonePresetItem.deleteMany({
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
          items: {
            create: dto.timezones.map((tz, index) => ({
              timezoneIdentifier: tz.timezoneIdentifier,
              displayLabel: tz.displayLabel,
              position: tz.position ?? index,
              startTime: tz.startTime,
              endTime: tz.endTime,
            })),
          },
        }),
      },
      include: { items: true },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.timezonePreset.delete({
      where: { id },
    });
  }

  async toggleFavorite(
    id: string,
    userId: string,
  ): Promise<PresetWithTimezones> {
    const preset = await this.findById(id, userId);
    return this.prisma.timezonePreset.update({
      where: { id },
      data: { isFavorite: !preset.isFavorite },
      include: { items: true },
    });
  }
}
