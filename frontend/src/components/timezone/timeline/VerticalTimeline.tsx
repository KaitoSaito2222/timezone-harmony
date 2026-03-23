'use client';
import { DateTime } from 'luxon';
import { useLocaleConfig } from '@/hooks/useLocaleConfig';
import { generateTimeSlots } from '@/lib/timeline';
import type { BusinessHoursMap } from '@/lib/timeline';

interface VerticalTimelineProps {
  timezones: string[];
  isNow: boolean;
  now: DateTime;
  selectedDT: DateTime;
  baseTime: DateTime;
  showBusinessHours: boolean;
  businessHours: BusinessHoursMap;
  selectedRow: number | null;
  onTimeSlotClick: (rowIndex: number) => void;
  getDisplayName: (identifier: string) => string;
  scrollRefs: React.RefObject<(HTMLDivElement | null)[]>;
  onScroll: (index: number) => void;
}

export function VerticalTimeline({
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
  scrollRefs,
  onScroll,
}: VerticalTimelineProps) {
  const { use24h } = useLocaleConfig();

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 sm:gap-3 min-w-fit pb-4">
        {timezones.map((timezone, colIndex) => {
          const currentLocalTime = isNow
            ? now.setZone(timezone)
            : selectedDT.setZone(timezone);
          const cityName = getDisplayName(timezone);
          const offset = currentLocalTime.toFormat('ZZ');
          const dateStr = currentLocalTime.toFormat('MMM dd, yyyy HH:mm');
          const tzBH = businessHours[timezone];
          const slots = generateTimeSlots(
            timezone,
            baseTime,
            tzBH?.startTime || null,
            tzBH?.endTime || null,
            showBusinessHours
          );

          return (
            <div key={timezone} className="shrink-0 w-32 sm:w-40 md:w-48">
              <div className="bg-primary text-primary-foreground rounded-t-lg p-2 sm:p-3 text-center">
                <div className="text-base sm:text-lg font-bold truncate">{cityName}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-0.5">{dateStr}</div>
                <div className="text-xs opacity-75">UTC{offset}</div>
              </div>
              <div
                ref={(el) => { scrollRefs.current[colIndex] = el; }}
                onScroll={() => onScroll(colIndex)}
                className="bg-muted/30 rounded-b-lg p-1 sm:p-1.5 max-h-125 overflow-y-auto space-y-0.5 overscroll-contain will-change-scroll"
              >
                {slots.map((slot, rowIndex) => (
                  <div
                    key={rowIndex}
                    onClick={() => onTimeSlotClick(rowIndex)}
                    className={`
                      ${slot.className}
                      ${selectedRow === rowIndex ? 'ring-2 ring-primary' : ''}
                      py-2.5 px-1 text-center rounded cursor-pointer transition-colors
                      hover:brightness-90 border-2
                    `}
                    style={slot.isNewDay ? { borderTopColor: 'black' } : undefined}
                  >
                    <div className="leading-none">
                      {use24h ? (
                        <span className="text-sm font-bold">{slot.hour}</span>
                      ) : (
                        <>
                          <span className="text-sm font-bold">{slot.hourLabel}</span>
                          <span className="text-xs text-muted-foreground ml-0.5">{slot.ampm}</span>
                        </>
                      )}
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
