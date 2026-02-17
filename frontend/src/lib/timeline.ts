import { DateTime } from 'luxon';

export interface TimeSlot {
  hour: number;
  formatted: string;
  className: string;
  fullTime: DateTime;
}

export interface OptimalTime {
  hour: number;
  times: { timezone: string; time: string; hour: number }[];
}

export interface BusinessHoursMap {
  [timezoneIdentifier: string]: {
    startTime: string | null;
    endTime: string | null;
  };
}

export const isInBusinessHours = (
  hour: number,
  startTime: string | null,
  endTime: string | null
): boolean => {
  const start = startTime ? parseInt(startTime.split(':')[0], 10) : 9;
  const end = endTime ? parseInt(endTime.split(':')[0], 10) : 17;
  return hour >= start && hour < end;
};

export const getTimeSlotClass = (
  hour: number,
  startTime: string | null,
  endTime: string | null,
  showHighlight: boolean
): string => {
  if (!showHighlight) return 'bg-muted/50';
  const start = startTime ? parseInt(startTime.split(':')[0], 10) : 9;
  const end = endTime ? parseInt(endTime.split(':')[0], 10) : 17;
  if (isInBusinessHours(hour, startTime, endTime)) {
    return 'bg-green-100 dark:bg-green-900/30 border-green-500';
  } else if (hour === start - 1 || hour === end || hour === end + 1) {
    return 'bg-amber-100 dark:bg-amber-900/30 border-amber-500';
  }
  return 'bg-red-100 dark:bg-red-900/30 border-red-500';
};

export const generateTimeSlots = (
  timezone: string,
  baseTime: DateTime,
  startTime: string | null,
  endTime: string | null,
  showHighlight: boolean
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const localBase = baseTime.setZone(timezone);
  for (let i = 0; i < 24; i++) {
    const time = localBase.plus({ hours: i });
    slots.push({
      hour: time.hour,
      formatted: time.toFormat('HH:mm'),
      className: getTimeSlotClass(time.hour, startTime, endTime, showHighlight),
      fullTime: time,
    });
  }
  return slots;
};
