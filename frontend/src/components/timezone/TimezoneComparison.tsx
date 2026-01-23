import { useEffect, useState, useRef } from 'react';
import { DateTime } from 'luxon';
import { Lightbulb, AlertTriangle, BookmarkPlus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  hour: number;
  formatted: string;
  className: string;
  fullTime: DateTime;
}

interface TimezoneComparisonProps {
  timezones: string[];
}

const timezoneNames: Record<string, string> = {
  'Asia/Tokyo': 'Tokyo',
  'America/New_York': 'New York',
  'Europe/London': 'London',
  'America/Los_Angeles': 'Los Angeles',
  'Europe/Paris': 'Paris',
  'Asia/Singapore': 'Singapore',
  'Australia/Sydney': 'Sydney',
  'Asia/Dubai': 'Dubai',
  'America/Chicago': 'Chicago',
  'Asia/Hong_Kong': 'Hong Kong',
};

const isBusinessHours = (hour: number): boolean => {
  return hour >= 9 && hour < 17;
};

const getTimeSlotClass = (hour: number): string => {
  if (isBusinessHours(hour)) {
    return 'bg-green-100 dark:bg-green-900/30 border-green-500';
  } else if (hour === 8 || hour === 17 || hour === 18) {
    return 'bg-amber-100 dark:bg-amber-900/30 border-amber-500';
  }
  return 'bg-red-100 dark:bg-red-900/30 border-red-500';
};

const generateTimeSlots = (timezone: string, baseTime: DateTime): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const localBase = baseTime.setZone(timezone);
  for (let i = 0; i < 24; i++) {
    const time = localBase.plus({ hours: i });
    slots.push({
      hour: time.hour,
      formatted: time.toFormat('HH:mm'),
      className: getTimeSlotClass(time.hour),
      fullTime: time,
    });
  }
  return slots;
};

interface OptimalTime {
  hour: number;
  times: { timezone: string; time: string; hour: number }[];
}

export function TimezoneComparison({ timezones }: TimezoneComparisonProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    findOptimalMeetingTimes();
  }, [timezones]);

  const findOptimalMeetingTimes = () => {
    if (timezones.length === 0) return;

    const now = DateTime.now();
    const baseTime = now.startOf('day');
    const optimal: OptimalTime[] = [];

    for (let hour = 0; hour < 24; hour++) {
      let allBusinessHours = true;
      const timesByZone: { timezone: string; time: string; hour: number }[] = [];

      timezones.forEach((timezone) => {
        const time = baseTime.setZone(timezone).plus({ hours: hour });
        timesByZone.push({
          timezone: timezoneNames[timezone] || timezone.split('/')[1] || timezone,
          time: time.toFormat('HH:mm'),
          hour: time.hour,
        });

        if (!isBusinessHours(time.hour)) {
          allBusinessHours = false;
        }
      });

      if (allBusinessHours) {
        optimal.push({ hour, times: timesByZone });
      }
    }

    setOptimalTimes(optimal);
  };

  const handleScroll = (index: number) => {
    const scrollTop = scrollRefs.current[index]?.scrollTop || 0;
    scrollRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        ref.scrollTop = scrollTop;
      }
    });
  };

  const handleTimeSlotClick = (row: number) => {
    setSelectedRow(row === selectedRow ? null : row);
  };

  if (timezones.length === 0) {
    return null;
  }

  const now = DateTime.now();
  const baseTime = now.startOf('day');

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Comparison</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border-2 border-green-500" />
              <span>Business Hours (9-17)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500" />
              <span>Partial Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-500" />
              <span>Off Hours</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-fit pb-4">
              {timezones.map((timezone, colIndex) => {
                const localTime = baseTime.setZone(timezone);
                const cityName = timezoneNames[timezone] || timezone.split('/')[1] || timezone;
                const offset = localTime.toFormat('ZZ');
                const dateStr = localTime.toFormat('MMM dd, yyyy');
                const slots = generateTimeSlots(timezone, baseTime);

                return (
                  <div
                    key={timezone}
                    className="flex-shrink-0 w-64"
                  >
                    {/* Timezone Header */}
                    <div className="bg-primary text-primary-foreground rounded-t-lg p-4 text-center">
                      <div className="text-lg font-bold mb-1">{cityName}</div>
                      <div className="text-sm opacity-90">UTC{offset}</div>
                      <div className="text-xs opacity-80 mt-1">{dateStr}</div>
                    </div>

                    {/* Time Slots */}
                    <div
                      ref={(el) => { scrollRefs.current[colIndex] = el; }}
                      onScroll={() => handleScroll(colIndex)}
                      className="bg-muted/30 rounded-b-lg p-2 max-h-[500px] overflow-y-auto space-y-1"
                    >
                      {slots.map((slot, rowIndex) => (
                        <div
                          key={rowIndex}
                          onClick={() => handleTimeSlotClick(rowIndex)}
                          className={`
                            ${slot.className}
                            ${selectedRow === rowIndex ? 'ring-2 ring-primary scale-105' : ''}
                            p-3 text-center rounded-lg cursor-pointer transition-all duration-200
                            hover:scale-105 hover:shadow-md border-2
                          `}
                        >
                          <div className="text-sm font-bold">
                            {slot.formatted}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimal Meeting Times */}
      {optimalTimes.length > 0 ? (
        <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Lightbulb className="h-5 w-5" />
              Recommended Meeting Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 dark:text-green-400 mb-4">
              Found {optimalTimes.length} time slots where all participants are within business hours!
            </p>
            <div className="flex flex-wrap gap-3">
              {optimalTimes.slice(0, 5).map((opt, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-2 text-sm border-green-500 bg-white dark:bg-green-950"
                >
                  {opt.times.map((t) => `${t.timezone}: ${t.time}`).join(' | ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              No Perfect Match Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 dark:text-amber-400">
              No time slots found where all participants are within business hours.
              Some participants may need to meet outside their normal hours.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button>
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save as Preset
        </Button>
        <Button variant="secondary">
          <Calendar className="h-4 w-4 mr-2" />
          Export to Calendar (.ics)
        </Button>
      </div>
    </div>
  );
}
