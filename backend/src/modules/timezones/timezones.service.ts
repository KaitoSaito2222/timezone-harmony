import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '../../prisma/prisma.service';
import { Timezone } from '@prisma/client';

export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  region?: string | null;
}

@Injectable()
export class TimezonesService {
  constructor(private prisma: PrismaService) {}

  private formatOffset(minutes: number): string {
    const sign = minutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private toTimezoneInfo(tz: Timezone): TimezoneInfo {
    return {
      identifier: tz.identifier,
      displayName: tz.displayName,
      offset: this.formatOffset(tz.utcOffsetMinutes),
      offsetMinutes: tz.utcOffsetMinutes,
      region: tz.region,
    };
  }

  async getAllTimezones(): Promise<TimezoneInfo[]> {
    const timezones = await this.prisma.timezone.findMany({
      orderBy: [{ sortOrder: 'asc' }, { utcOffsetMinutes: 'asc' }],
    });
    return timezones.map((tz) => this.toTimezoneInfo(tz));
  }

  async getPopularTimezones(): Promise<TimezoneInfo[]> {
    const timezones = await this.prisma.timezone.findMany({
      where: { isPopular: true },
      orderBy: { sortOrder: 'asc' },
    });
    return timezones.map((tz) => this.toTimezoneInfo(tz));
  }

  async searchTimezones(query: string): Promise<TimezoneInfo[]> {
    const timezones = await this.prisma.timezone.findMany({
      where: {
        OR: [
          { identifier: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
    return timezones.map((tz) => this.toTimezoneInfo(tz));
  }

  async getTimezoneInfo(identifier: string): Promise<TimezoneInfo | null> {
    const tz = await this.prisma.timezone.findUnique({
      where: { identifier },
    });
    if (!tz) return null;
    return this.toTimezoneInfo(tz);
  }

  convertTime(
    isoTime: string,
    fromZone: string,
    toZone: string,
  ): string | null {
    try {
      return DateTime.fromISO(isoTime, { zone: fromZone })
        .setZone(toZone)
        .toISO();
    } catch {
      return null;
    }
  }

  getCurrentTime(timezone: string): {
    iso: string;
    formatted: string;
    offset: string;
  } | null {
    try {
      const now = DateTime.now().setZone(timezone);
      return {
        iso: now.toISO() || '',
        formatted: now.toFormat('yyyy-MM-dd HH:mm:ss'),
        offset: now.offsetNameShort || '',
      };
    } catch {
      return null;
    }
  }

  getMultipleTimezonesTimes(timezones: string[]): {
    timezone: string;
    currentTime: string;
    offset: string;
  }[] {
    return timezones
      .map((tz) => {
        const time = this.getCurrentTime(tz);
        if (!time) return null;
        return {
          timezone: tz,
          currentTime: time.formatted,
          offset: time.offset,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }
}
