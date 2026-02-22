'use client';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import {
  Globe,
  BookmarkPlus,
  Plus,
  X,
  Calendar,
  ChevronDown,
  Star,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TimezonePreset } from '@/types/preset.types';
import { MAX_TIMEZONES } from '@/stores/timezoneStore';

interface TimelineHeaderProps {
  timezones: string[];
  onAddTimezone: () => void;
  onRemoveTimezone: (identifier: string) => void;
  isAuthenticated: boolean;
  presets: TimezonePreset[];
  onLoadPreset: (preset: TimezonePreset) => void;
  onOpenSaveDialog: () => void;
  selectedDateTime: string;
  onDateTimeChange: (value: string) => void;
  baseTimezone: string;
  onBaseTimezoneChange: (value: string) => void;
  isNow: boolean;
  onReset: () => void;
}

export function TimelineHeader({
  timezones,
  onAddTimezone,
  onRemoveTimezone,
  isAuthenticated,
  presets,
  onLoadPreset,
  onOpenSaveDialog,
  selectedDateTime,
  onDateTimeChange,
  baseTimezone,
  onBaseTimezoneChange,
  isNow,
  onReset,
}: TimelineHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Timeline Comparison
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
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
                {timezones.length > 0 && (
                  <>
                    <DropdownMenuItem onClick={onOpenSaveDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Current as Preset
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {presets.length > 0 ? (
                  <>
                    {presets.map((preset) => (
                      <DropdownMenuItem
                        key={preset.id}
                        onClick={() => onLoadPreset(preset)}
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
                    <DropdownMenuItem disabled>No presets yet</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push('/presets')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Presets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            onClick={onAddTimezone}
            size="sm"
            className="h-9"
            disabled={timezones.length >= MAX_TIMEZONES}
            title={timezones.length >= MAX_TIMEZONES ? `Max ${MAX_TIMEZONES} timezones` : undefined}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Timezone
            <span className="ml-1.5 text-xs opacity-70">
              {timezones.length}/{MAX_TIMEZONES}
            </span>
          </Button>
        </div>
      </div>

      {timezones.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => onDateTimeChange(e.target.value)}
              className="w-auto"
            />
            <span className="text-sm text-muted-foreground">in</span>
            <select
              value={baseTimezone}
              onChange={(e) => onBaseTimezoneChange(e.target.value)}
              className="h-9 px-3 py-1 rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
            >
              <option value="local">Local ({DateTime.local().zoneName})</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.split('/')[1]?.replace(/_/g, ' ') || tz}
                </option>
              ))}
            </select>
            {!isNow && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
        </div>
      )}

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
          No timezones selected. Click &quot;Add Timezone&quot; to get started.
        </p>
      )}
    </>
  );
}
