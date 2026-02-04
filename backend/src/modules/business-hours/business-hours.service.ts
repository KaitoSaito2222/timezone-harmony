import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessHours } from '@prisma/client';

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
  constructor(private prisma: PrismaService) {}

  private parseTimeString(timeStr: string): Date {
    const [hours, minutes, seconds = '00'] = timeStr.split(':');
    const date = new Date(1970, 0, 1);
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10));
    return date;
  }

  async findAllByUser(userId: string): Promise<BusinessHours[]> {
    return this.prisma.businessHours.findMany({
      where: { userId },
      orderBy: [{ timezoneIdentifier: 'asc' }, { dayOfWeek: 'asc' }],
    });
  }

  async findByTimezone(
    userId: string,
    timezoneIdentifier: string,
  ): Promise<BusinessHours[]> {
    return this.prisma.businessHours.findMany({
      where: { userId, timezoneIdentifier },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async findById(id: string, userId: string): Promise<BusinessHours> {
    const businessHours = await this.prisma.businessHours.findFirst({
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
    const existing = await this.prisma.businessHours.findFirst({
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

    return this.prisma.businessHours.create({
      data: {
        userId,
        timezoneIdentifier: dto.timezoneIdentifier,
        dayOfWeek: dto.dayOfWeek,
        startTime: this.parseTimeString(dto.startTime),
        endTime: this.parseTimeString(dto.endTime),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async bulkCreate(
    userId: string,
    dto: BulkCreateBusinessHoursDto,
  ): Promise<BusinessHours[]> {
    await this.prisma.businessHours.deleteMany({
      where: {
        userId,
        timezoneIdentifier: dto.timezoneIdentifier,
      },
    });

    const created = await Promise.all(
      dto.hours.map((hour) =>
        this.prisma.businessHours.create({
          data: {
            userId,
            timezoneIdentifier: dto.timezoneIdentifier,
            dayOfWeek: hour.dayOfWeek,
            startTime: this.parseTimeString(hour.startTime),
            endTime: this.parseTimeString(hour.endTime),
            isActive: hour.isActive ?? true,
          },
        }),
      ),
    );

    return created;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateBusinessHoursDto,
  ): Promise<BusinessHours> {
    await this.findById(id, userId);

    return this.prisma.businessHours.update({
      where: { id },
      data: {
        ...(dto.startTime !== undefined && { startTime: this.parseTimeString(dto.startTime) }),
        ...(dto.endTime !== undefined && { endTime: this.parseTimeString(dto.endTime) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.businessHours.delete({
      where: { id },
    });
  }

  async deleteByTimezone(
    userId: string,
    timezoneIdentifier: string,
  ): Promise<void> {
    await this.prisma.businessHours.deleteMany({
      where: {
        userId,
        timezoneIdentifier,
      },
    });
  }
}
