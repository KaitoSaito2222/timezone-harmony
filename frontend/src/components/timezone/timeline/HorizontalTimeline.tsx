'use client';
import { DateTime } from 'luxon';
import { generateTimeSlots } from '@/lib/timeline';
import type { BusinessHoursMap } from '@/lib/timeline';

interface HorizontalTimelineProps {
  timezones: string[];
  isNow: boolean;
  now: DateTime;
  selectedDT: DateTime;
  baseTime: DateTime;
  showBusinessHours: boolean;
  businessHours: BusinessHoursMap;
  selectedRow: number | null;
  onTimeSlotClick: (slotIndex: number) => void;
  getDisplayName: (identifier: string) => string;
}

export function HorizontalTimeline({
  timezones,
  isNow,
  now,
  selectedDT,
  baseTime,
  showBusinessHours,
  businessHours,
  selectedRow,
  onTimeSlotClick,
  getDisplayName,
}: HorizontalTimelineProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit space-y-2 pb-4">
        {timezones.map((timezone) => {
          const currentLocalTime = isNow
            ? now.setZone(timezone)
            : selectedDT.setZone(timezone);
          const cityName = getDisplayName(timezone);
          const offset = currentLocalTime.toFormat('ZZ');
          const dateStr = currentLocalTime.toFormat('MMM dd, HH:mm');
          const tzBH = businessHours[timezone];
          const slots = generateTimeSlots(
            timezone,
            baseTime,
            tzBH?.startTime || null,
            tzBH?.endTime || null,
            showBusinessHours
          );

          return (
            <div key={timezone} className="flex">
              <div className="sticky left-0 z-10 bg-primary text-primary-foreground rounded-l-lg p-3 w-36 sm:w-44 flex flex-col justify-center shrink-0 overflow-hidden">
                <div className="font-bold text-sm truncate">{cityName}</div>
                <div className="text-xs opacity-80">UTC{offset}</div>
                <div className="text-xs opacity-70">{dateStr}</div>
              </div>
              <div className="flex gap-1 items-center p-1.5 bg-muted/30 rounded-r-lg">
                {slots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    onClick={() => onTimeSlotClick(slotIndex)}
                    className={`
                      ${slot.className}
                      ${selectedRow === slotIndex ? 'ring-2 ring-primary scale-105' : ''}
                      p-2 text-center rounded-lg cursor-pointer transition-all duration-200
                      hover:scale-105 hover:shadow-md border-2 min-w-14
                    `}
                    style={slot.isNewDay ? { borderLeftColor: 'black' } : undefined}
                  >
                    <div className="leading-none">
                      <span className="text-xs font-bold">{slot.hourLabel}</span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">{slot.ampm}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
