import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessHours } from '../../entities';

interface CreateBusinessHoursDto {
  timezoneIdentifier: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

interface UpdateBusinessHoursDto {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

interface BulkCreateBusinessHoursDto {
  timezoneIdentifier: string;
  hours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  }[];
}

@Injectable()
export class BusinessHoursService {
  constructor(
    @InjectRepository(BusinessHours)
    private businessHoursRepository: Repository<BusinessHours>,
  ) {}

  async findAllByUser(userId: string): Promise<BusinessHours[]> {
    return this.businessHoursRepository.find({
      where: { userId },
      order: { timezoneIdentifier: 'ASC', dayOfWeek: 'ASC' },
    });
  }

  async findByTimezone(
    userId: string,
    timezoneIdentifier: string,
  ): Promise<BusinessHours[]> {
    return this.businessHoursRepository.find({
      where: { userId, timezoneIdentifier },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async findById(id: string, userId: string): Promise<BusinessHours> {
    const businessHours = await this.businessHoursRepository.findOne({
      where: { id, userId },
    });
    if (!businessHours) {
      throw new NotFoundException('Business hours not found');
    }
    return businessHours;
  }

  async create(
    userId: string,
    dto: CreateBusinessHoursDto,
  ): Promise<BusinessHours> {
    const existing = await this.businessHoursRepository.findOne({
      where: {
        userId,
        timezoneIdentifier: dto.timezoneIdentifier,
        dayOfWeek: dto.dayOfWeek,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Business hours already exist for this timezone and day',
      );
    }

    const businessHours = this.businessHoursRepository.create({
      userId,
      ...dto,
      isActive: dto.isActive ?? true,
    });

    return this.businessHoursRepository.save(businessHours);
  }

  async bulkCreate(
    userId: string,
    dto: BulkCreateBusinessHoursDto,
  ): Promise<BusinessHours[]> {
    await this.businessHoursRepository.delete({
      userId,
      timezoneIdentifier: dto.timezoneIdentifier,
    });

    const businessHoursEntities = dto.hours.map((hour) =>
      this.businessHoursRepository.create({
        userId,
        timezoneIdentifier: dto.timezoneIdentifier,
        dayOfWeek: hour.dayOfWeek,
        startTime: hour.startTime,
        endTime: hour.endTime,
        isActive: hour.isActive ?? true,
      }),
    );

    return this.businessHoursRepository.save(businessHoursEntities);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateBusinessHoursDto,
  ): Promise<BusinessHours> {
    const businessHours = await this.findById(id, userId);

    if (dto.startTime !== undefined) businessHours.startTime = dto.startTime;
    if (dto.endTime !== undefined) businessHours.endTime = dto.endTime;
    if (dto.isActive !== undefined) businessHours.isActive = dto.isActive;

    return this.businessHoursRepository.save(businessHours);
  }

  async delete(id: string, userId: string): Promise<void> {
    const businessHours = await this.findById(id, userId);
    await this.businessHoursRepository.remove(businessHours);
  }

  async deleteByTimezone(
    userId: string,
    timezoneIdentifier: string,
  ): Promise<void> {
    await this.businessHoursRepository.delete({
      userId,
      timezoneIdentifier,
    });
  }
}
