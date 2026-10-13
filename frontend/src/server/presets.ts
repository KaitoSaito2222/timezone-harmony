import { DateTime } from 'luxon';
import { z } from 'zod';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from './db';
import { badRequest, notFound } from './http';

const VALID_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));
const TIME_FORMAT_REGEX = /^\d{2}:\d{2}$/;

const timezoneItemSchema = z.object({
  timezoneIdentifier: z
    .string()
    .refine((tz) => VALID_TIMEZONES.has(tz), 'timezoneIdentifier must be a valid IANA timezone (e.g. "America/New_York")'),
  displayLabel: z.string().nullish(),
  position: z.number().nullish(),
  startTime: z.string().regex(TIME_FORMAT_REGEX, 'startTime must be in HH:mm format (e.g. "09:00")').nullish(),
  endTime: z.string().regex(TIME_FORMAT_REGEX, 'endTime must be in HH:mm format (e.g. "18:00")').nullish(),
});

export const createPresetSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  isFavorite: z.boolean().nullish(),
  timezones: z.array(timezoneItemSchema),
});

export const updatePresetSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullish(),
  isFavorite: z.boolean().optional(),
  timezones: z.array(timezoneItemSchema).optional(),
});

type TimezoneItemInput = z.output<typeof timezoneItemSchema>;
type CreatePresetInput = z.output<typeof createPresetSchema>;
type UpdatePresetInput = z.output<typeof updatePresetSchema>;

// Derived from the query shape so Prisma guarantees items is always present.
type PresetWithTimezones = Prisma.TimezonePresetGetPayload<{ include: { items: true } }>;

// Reference date used for all business hours conversions (2000-01-01).
const DEFAULT_REF = { year: 2000, month: 1, day: 1 } as const;

/**
 * Convert "HH:mm" local time in the given timezone to a UTC Date object
 * using the fixed reference date 2000-01-01.
 */
function timeStringToUtcDate(timeStr: string, timezone: string): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  return DateTime.fromObject({ ...DEFAULT_REF, hour, minute }, { zone: timezone }).toUTC().toJSDate();
}

/**
 * Convert a UTC Date (stored with reference date 2000-01-01) back to "HH:mm"
 * in the given timezone.
 */
function utcDateToTimeString(date: Date, timezone: string): string {
  return DateTime.fromJSDate(date, { zone: 'UTC' }).setZone(timezone).toFormat('HH:mm');
}

// Returns startTime/endTime as "HH:mm" strings instead of Dates.
function mapPreset(preset: PresetWithTimezones) {
  return {
    ...preset,
    items: preset.items.map((item) => ({
      ...item,
      startTime: item.startTime ? utcDateToTimeString(item.startTime, item.timezoneIdentifier) : null,
      endTime: item.endTime ? utcDateToTimeString(item.endTime, item.timezoneIdentifier) : null,
    })),
  };
}

function toItemCreate(timezones: TimezoneItemInput[]) {
  return timezones.map((tz, index) => ({
    timezoneIdentifier: tz.timezoneIdentifier,
    displayLabel: tz.displayLabel,
    position: tz.position ?? index,
    startTime: tz.startTime ? timeStringToUtcDate(tz.startTime, tz.timezoneIdentifier) : undefined,
    endTime: tz.endTime ? timeStringToUtcDate(tz.endTime, tz.timezoneIdentifier) : undefined,
  }));
}

export async function findAllByUser(userId: string) {
  const presets = await prisma.timezonePreset.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return presets.map(mapPreset);
}

export async function findById(id: string, userId: string) {
  const preset = await prisma.timezonePreset.findFirst({
    where: { id, userId },
    include: { items: true },
  });
  if (!preset) throw notFound('Preset not found');
  return mapPreset(preset);
}

export async function create(userId: string, dto: CreatePresetInput) {
  if (!dto.timezones) throw badRequest('Timezones array is required');
  const preset = await prisma.timezonePreset.create({
    data: {
      userId,
      name: dto.name,
      description: dto.description,
      isFavorite: dto.isFavorite ?? false,
      items: { create: toItemCreate(dto.timezones) },
    },
    include: { items: true },
  });
  return mapPreset(preset);
}

export async function update(id: string, userId: string, dto: UpdatePresetInput) {
  await findById(id, userId);

  if (dto.timezones) {
    await prisma.timezonePresetItem.deleteMany({ where: { presetId: id } });
  }

  const preset = await prisma.timezonePreset.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.isFavorite !== undefined && { isFavorite: dto.isFavorite }),
      ...(dto.timezones && { items: { create: toItemCreate(dto.timezones) } }),
    },
    include: { items: true },
  });
  return mapPreset(preset);
}

export async function remove(id: string, userId: string): Promise<void> {
  await findById(id, userId);
  await prisma.timezonePreset.delete({ where: { id } });
}

export async function toggleFavorite(id: string, userId: string) {
  const preset = await findById(id, userId);
  const updated = await prisma.timezonePreset.update({
    where: { id },
    data: { isFavorite: !preset.isFavorite },
    include: { items: true },
  });
  return mapPreset(updated);
}
