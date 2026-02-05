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

export function TimezoneComparison({ timezones, onAddTimezone, onRemoveTimezone }: TimezoneComparisonProps) {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { allTimezones, setSelectedTimezones } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();

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

  const loadPresets = async () => {
    try {
      const data = await presetService.getAll();
      setPresets(data);
    } catch {
      // Silently fail - presets are optional
    }
  };

  const handleLoadPreset = (preset: TimezonePreset) => {
    const identifiers = preset.timezones
      .sort((a, b) => a.position - b.position)
      .map((tz) => tz.timezoneIdentifier);
    setSelectedTimezones(identifiers);
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

    const now = DateTime.now();
    const baseTime = now.startOf('day');
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

        if (!isBusinessHours(time.hour)) {
          allBusinessHours = false;
        }
      });

      if (allBusinessHours) {
        optimal.push({ hour, times: timesByZone });
      }
    }

    setOptimalTimes(optimal);
  }, [timezones, getDisplayName]);

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
  const baseTime = now.startOf('day');

  return (
    <div className="space-y-6">
      {/* Combined Timezone Selection + Timeline Comparison */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Timeline Comparison
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Preset Dropdown */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Presets
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
                      <DropdownMenuItem disabled>
                        No presets yet
                      </DropdownMenuItem>
                    )}
                    {timezones.length > 0 && (
                      <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Save Current as Preset
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/presets')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Presets
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button onClick={onAddTimezone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Timezone
              </Button>
            </div>
          </div>

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

          {/* Legend */}
          {timezones.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2 border-t">
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
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-fit pb-4">
              {timezones.map((timezone, colIndex) => {
                const localTime = baseTime.setZone(timezone);
                const cityName = getDisplayName(timezone);
                const offset = localTime.toFormat('ZZ');
                const dateStr = localTime.toFormat('MMM dd, yyyy');
                const slots = generateTimeSlots(timezone, baseTime);

                return (
                  <div
                    key={timezone}
                    className="shrink-0 w-64"
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

          {/* Action Buttons - inside the card */}
          <div className="flex justify-center gap-3 pt-4 border-t">
            {isAuthenticated && (
              <Button size="sm" onClick={() => setIsSaveDialogOpen(true)}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save as Preset
              </Button>
            )}
            <Button size="sm" variant="secondary">
              <Calendar className="h-4 w-4 mr-2" />
              Export to Calendar
            </Button>
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
