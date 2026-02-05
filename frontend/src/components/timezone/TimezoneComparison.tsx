import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  Lightbulb,
  AlertTriangle,
  BookmarkPlus,
  Calendar,
  Plus,
  X,
  Globe,
  ChevronDown,
  Star,
  Settings,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { presetService } from '@/services/preset.service';
import type { TimezonePreset } from '@/types/preset.types';
import { toast } from 'sonner';

interface TimeSlot {
  hour: number;
  formatted: string;
  className: string;
  fullTime: DateTime;
}

interface TimezoneComparisonProps {
  timezones: string[];
  onAddTimezone: () => void;
  onRemoveTimezone: (identifier: string) => void;
}

const isInBusinessHours = (
  hour: number,
  startTime: string | null,
  endTime: string | null
): boolean => {
  const start = startTime ? parseInt(startTime.split(':')[0], 10) : 9;
  const end = endTime ? parseInt(endTime.split(':')[0], 10) : 17;
  return hour >= start && hour < end;
};

const getTimeSlotClass = (
  hour: number,
  startTime: string | null,
  endTime: string | null,
  showHighlight: boolean
): string => {
  if (!showHighlight) {
    return 'bg-muted/50';
  }

  const start = startTime ? parseInt(startTime.split(':')[0], 10) : 9;
  const end = endTime ? parseInt(endTime.split(':')[0], 10) : 17;

  if (isInBusinessHours(hour, startTime, endTime)) {
    return 'bg-green-100 dark:bg-green-900/30 border-green-500';
  } else if (hour === start - 1 || hour === end || hour === end + 1) {
    return 'bg-amber-100 dark:bg-amber-900/30 border-amber-500';
  }
  return 'bg-red-100 dark:bg-red-900/30 border-red-500';
};

const generateTimeSlots = (
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

interface OptimalTime {
  hour: number;
  times: { timezone: string; time: string; hour: number }[];
}

export function TimezoneComparison({ timezones, onAddTimezone, onRemoveTimezone }: TimezoneComparisonProps) {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { allTimezones, businessHours, loadPreset: loadPresetToStore } = useTimezoneStore();
  const [showBusinessHours, setShowBusinessHours] = useState(() => {
    const saved = localStorage.getItem('showBusinessHours');
    return saved !== 'false';
  });
  const { isAuthenticated } = useAuthStore();

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return DateTime.now().toFormat('yyyy-MM-dd');
  });

  // Preset state
  const [presets, setPresets] = useState<TimezonePreset[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');

  // Load presets on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadPresets();
    }
  }, [isAuthenticated]);

  // Save business hours toggle preference
  useEffect(() => {
    localStorage.setItem('showBusinessHours', String(showBusinessHours));
  }, [showBusinessHours]);

  const loadPresets = async () => {
    try {
      const data = await presetService.getAll();
      setPresets(data);
    } catch {
      // Silently fail - presets are optional
    }
  };

  const handleLoadPreset = (preset: TimezonePreset) => {
    loadPresetToStore(preset);
    toast.success(`Loaded "${preset.name}"`);
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      toast.error('Preset name is required');
      return;
    }
    if (timezones.length === 0) {
      toast.error('Add at least one timezone first');
      return;
    }

    try {
      await presetService.create({
        name: presetName,
        description: presetDescription || undefined,
        timezones: timezones.map((tz, index) => ({
          timezoneIdentifier: tz,
          position: index,
        })),
      });
      toast.success('Preset saved!');
      setIsSaveDialogOpen(false);
      setPresetName('');
      setPresetDescription('');
      loadPresets();
    } catch {
      toast.error('Failed to save preset');
    }
  };

  const getDisplayName = useCallback((identifier: string): string => {
    const tz = allTimezones.find((t) => t.identifier === identifier);
    if (tz) return tz.displayName;
    // フォールバック: "Asia/Tokyo" → "Tokyo"
    return identifier.split('/')[1]?.replace(/_/g, ' ') || identifier;
  }, [allTimezones]);

  const findOptimalMeetingTimes = useCallback(() => {
    if (timezones.length === 0) return;

    const baseTime = DateTime.fromISO(selectedDate).startOf('day');
    const optimal: OptimalTime[] = [];

    for (let hour = 0; hour < 24; hour++) {
      let allBusinessHours = true;
      const timesByZone: { timezone: string; time: string; hour: number }[] = [];

      timezones.forEach((timezone) => {
        const time = baseTime.setZone(timezone).plus({ hours: hour });
        timesByZone.push({
          timezone: getDisplayName(timezone),
          time: time.toFormat('HH:mm'),
          hour: time.hour,
        });

        if (!isInBusinessHours(time.hour, null, null)) {
          allBusinessHours = false;
        }
      });

      if (allBusinessHours) {
        optimal.push({ hour, times: timesByZone });
      }
    }

    setOptimalTimes(optimal);
  }, [timezones, getDisplayName, selectedDate]);

    useEffect(() => {
    findOptimalMeetingTimes();
  }, [findOptimalMeetingTimes]);

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

  const now = DateTime.now();
  const baseTime = DateTime.fromISO(selectedDate).startOf('day');
  const isToday = selectedDate === now.toFormat('yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Combined Timezone Selection + Timeline Comparison */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Timeline Comparison
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Preset Dropdown */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <BookmarkPlus className="h-4 w-4 mr-1.5" />
                      Presets
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* Save Current - always at top when timezones exist */}
                    {timezones.length > 0 && (
                      <>
                        <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Save Current as Preset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {/* Existing presets */}
                    {presets.length > 0 ? (
                      <>
                        {presets.map((preset) => (
                          <DropdownMenuItem
                            key={preset.id}
                            onClick={() => handleLoadPreset(preset)}
                          >
                            <span className="flex items-center gap-2">
                              {preset.isFavorite && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                              {preset.name}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem disabled>
                          No presets yet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/presets')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Presets
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {/* Export to Calendar */}
              {timezones.length > 0 && (
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
              <Button onClick={onAddTimezone} size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Timezone
              </Button>
            </div>
          </div>

          {/* Date Picker */}
          {timezones.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Label htmlFor="date-picker" className="text-sm font-medium whitespace-nowrap">
                  Check date:
                </Label>
                <Input
                  id="date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto h-8"
                />
                {!isToday && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedDate(DateTime.now().toFormat('yyyy-MM-dd'))}
                  >
                    Today
                  </Button>
                )}
              </div>
              {!isToday && (
                <span className="text-xs text-muted-foreground">
                  Showing times for {DateTime.fromISO(selectedDate).toFormat('MMMM d, yyyy')}
                </span>
              )}
            </div>
          )}

          {/* Selected Timezones */}
          {timezones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {timezones.map((tz) => (
                <Badge
                  key={tz}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  <span>{tz.split('/')[1]?.replace(/_/g, ' ') || tz}</span>
                  <button
                    onClick={() => onRemoveTimezone(tz)}
                    className="hover:bg-muted rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No timezones selected. Click "Add Timezone" to get started.
            </p>
          )}

        </CardHeader>
        <CardContent>
          {timezones.length === 0 ? (
            <div className="py-12 text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Timezones Selected</h3>
              <p className="text-muted-foreground mb-6">
                Click "Add Timezone" to start comparing times across different regions
              </p>
              <Button onClick={onAddTimezone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Timezone
              </Button>
            </div>
          ) : (
          <>
          {/* Work Hours Toggle & Legend */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            {showBusinessHours ? (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-500" />
                  <span>Work</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-500" />
                  <span>Partial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-500" />
                  <span>Off</span>
                </div>
              </div>
            ) : (
              <div />
            )}
            <Button
              variant={showBusinessHours ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowBusinessHours(!showBusinessHours)}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {showBusinessHours ? 'Hide' : 'Show Work Hours'}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-fit pb-4">
              {timezones.map((timezone, colIndex) => {
                const currentLocalTime = isToday ? now.setZone(timezone) : baseTime.setZone(timezone);
                const cityName = getDisplayName(timezone);
                const offset = currentLocalTime.toFormat('ZZ');
                const dateStr = isToday
                  ? currentLocalTime.toFormat('MMM dd, yyyy HH:mm')
                  : currentLocalTime.toFormat('MMM dd, yyyy');
                const tzBusinessHours = businessHours[timezone];
                const slots = generateTimeSlots(
                  timezone,
                  baseTime,
                  tzBusinessHours?.startTime || null,
                  tzBusinessHours?.endTime || null,
                  showBusinessHours
                );

                return (
                  <div
                    key={timezone}
                    className="shrink-0 w-48 sm:w-56 md:w-64"
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
                      className="bg-muted/30 rounded-b-lg p-2 max-h-125 overflow-y-auto space-y-1"
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

          </>
          )}
        </CardContent>
      </Card>

      {/* Optimal Meeting Times - only show when timezones are selected */}
      {timezones.length > 0 && (
        <>
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
        </>
      )}

      {/* Save Preset Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save as Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Team Meeting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-description">Description (optional)</Label>
              <Textarea
                id="preset-description"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="e.g., Weekly sync with US and EU teams"
                rows={2}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Timezones to save: {timezones.length}
              <div className="flex flex-wrap gap-1 mt-2">
                {timezones.map((tz) => (
                  <Badge key={tz} variant="secondary" className="text-xs">
                    {tz.split('/')[1]?.replace(/_/g, ' ') || tz}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset}>Save Preset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
