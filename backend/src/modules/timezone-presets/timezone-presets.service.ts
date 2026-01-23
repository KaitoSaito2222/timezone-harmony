import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimezonePreset, PresetTimezone } from '../../entities';

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

@Injectable()
export class TimezonePresetsService {
  constructor(
    @InjectRepository(TimezonePreset)
    private presetRepository: Repository<TimezonePreset>,
    @InjectRepository(PresetTimezone)
    private presetTimezoneRepository: Repository<PresetTimezone>,
  ) {}

  async findAllByUser(userId: string): Promise<TimezonePreset[]> {
    return this.presetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string): Promise<TimezonePreset> {
    const preset = await this.presetRepository.findOne({
      where: { id, userId },
    });
    if (!preset) {
      throw new NotFoundException('Preset not found');
    }
    return preset;
  }

  async create(userId: string, dto: CreatePresetDto): Promise<TimezonePreset> {
    const preset = this.presetRepository.create({
      userId,
      name: dto.name,
      description: dto.description,
      isFavorite: dto.isFavorite ?? false,
    });

    const savedPreset = await this.presetRepository.save(preset);

    if (dto.timezones && dto.timezones.length > 0) {
      const presetTimezones = dto.timezones.map((tz, index) =>
        this.presetTimezoneRepository.create({
          presetId: savedPreset.id,
          timezoneIdentifier: tz.timezoneIdentifier,
          displayLabel: tz.displayLabel,
          position: tz.position ?? index,
        }),
      );
      await this.presetTimezoneRepository.save(presetTimezones);
    }

    return this.findById(savedPreset.id, userId);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePresetDto,
  ): Promise<TimezonePreset> {
    const preset = await this.findById(id, userId);

    if (dto.name !== undefined) preset.name = dto.name;
    if (dto.description !== undefined) preset.description = dto.description;
    if (dto.isFavorite !== undefined) preset.isFavorite = dto.isFavorite;

    await this.presetRepository.save(preset);

    if (dto.timezones) {
      await this.presetTimezoneRepository.delete({ presetId: id });

      const presetTimezones = dto.timezones.map((tz, index) =>
        this.presetTimezoneRepository.create({
          presetId: id,
          timezoneIdentifier: tz.timezoneIdentifier,
          displayLabel: tz.displayLabel,
          position: tz.position ?? index,
        }),
      );
      await this.presetTimezoneRepository.save(presetTimezones);
    }

    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const preset = await this.findById(id, userId);
    await this.presetRepository.remove(preset);
  }

  async toggleFavorite(id: string, userId: string): Promise<TimezonePreset> {
    const preset = await this.findById(id, userId);
    preset.isFavorite = !preset.isFavorite;
    return this.presetRepository.save(preset);
  }
}
