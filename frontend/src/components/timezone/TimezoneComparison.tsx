'use client';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { getTimezoneCity, getLocaleFromPathname } from '@/lib/timezone-utils';
import { Globe, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { useTimeline } from '@/hooks/useTimeline';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';
import { usePresetActions } from '@/hooks/usePresetActions';
import { useCalendarExport } from '@/hooks/useCalendarExport';
import { useOptimalMeetingTimes } from '@/hooks/useOptimalMeetingTimes';
import { TimelineHeader } from './timeline/TimelineHeader';
import { TimelineControls } from './timeline/TimelineControls';
import { VerticalTimeline } from './timeline/VerticalTimeline';
import { HorizontalTimeline } from './timeline/HorizontalTimeline';
import { OptimalMeetingTimes } from './timeline/OptimalMeetingTimes';
import { SavePresetDialog } from './dialogs/SavePresetDialog';
import { CalendarExportDialog } from './dialogs/CalendarExportDialog';

interface TimezoneComparisonProps {
  timezones: string[];
  onAddTimezone: () => void;
  onRemoveTimezone: (identifier: string) => void;
  onClearTimezones?: () => void;
}

export function TimezoneComparison({
  timezones,
  onAddTimezone,
  onRemoveTimezone,
  onClearTimezones,
}: TimezoneComparisonProps) {
  const t = useTranslations('timezone');
  const { allTimezones, businessHours } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();

  const getDisplayName = useCallback(
    (identifier: string): string => {
      const tz = allTimezones.find((item) => item.identifier === identifier);
      if (!tz) return getTimezoneCity(identifier);
      const locale = getLocaleFromPathname();
      return tz.localizedCities?.[locale] ?? tz.displayName;
    },
    [allTimezones]
  );

  const timeline = useTimeline();
  const datePicker = useDateTimePicker(timezones);
  const presetActions = usePresetActions(timezones, isAuthenticated);
  const calendarExport = useCalendarExport({
    timezones,
    businessHours,
    baseTime: datePicker.baseTime,
    showBusinessHours: timeline.showBusinessHours,
    setSelectedRow: timeline.setSelectedRow,
  });
  const optimalTimes = useOptimalMeetingTimes(
    timezones,
    datePicker.selectedDateTime,
    datePicker.baseTimezone,
  );

  const now = DateTime.now();
  const sharedTimelineProps = {
    timezones,
    isNow: datePicker.isNow,
    now,
    selectedDT: datePicker.selectedDT,
    baseTime: datePicker.baseTime,
    showBusinessHours: timeline.showBusinessHours,
    businessHours,
    selectedRow: timeline.selectedRow,
    onTimeSlotClick: calendarExport.handleTimeSlotClick,
    getDisplayName,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <TimelineHeader
            timezones={timezones}
            onAddTimezone={onAddTimezone}
            onRemoveTimezone={onRemoveTimezone}
            onClearTimezones={onClearTimezones}
            isAuthenticated={isAuthenticated}
            presets={presetActions.presets}
            onLoadPreset={presetActions.handleLoadPreset}
            onOpenSaveDialog={() => presetActions.setIsSaveDialogOpen(true)}
            getDisplayName={getDisplayName}
            selectedDateTime={datePicker.selectedDateTime}
            onDateTimeChange={datePicker.handleDateTimeChange}
            baseTimezone={datePicker.baseTimezone}
            onBaseTimezoneChange={datePicker.setBaseTimezone}
            isNow={datePicker.isNow}
            onReset={datePicker.handleReset}
          />
        </CardHeader>
        <CardContent>
          {timezones.length === 0 ? (
            <div className="py-12 text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">{t('noTimezonesTitle')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('noTimezonesDesc')}
              </p>
              <Button onClick={onAddTimezone}>
                <Plus className="h-4 w-4 mr-2" />
                {t('addFirstTimezone')}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('clickSlotToExport')}</span>
                </p>
              </div>
              <TimelineControls
                showBusinessHours={timeline.showBusinessHours}
                onToggleBusinessHours={() =>
                  timeline.setShowBusinessHours((prev) => !prev)
                }
                layoutMode={timeline.layoutMode}
                onToggleLayout={timeline.toggleLayoutMode}
              />
              {timeline.layoutMode === 'vertical' ? (
                <VerticalTimeline
                  {...sharedTimelineProps}
                  scrollRefs={timeline.scrollRefs}
                  onScroll={timeline.handleScroll}
                />
              ) : (
                <HorizontalTimeline {...sharedTimelineProps} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {timezones.length > 0 && <OptimalMeetingTimes optimalTimes={optimalTimes} getDisplayName={getDisplayName} />}

      <SavePresetDialog
        open={presetActions.isSaveDialogOpen}
        onOpenChange={presetActions.setIsSaveDialogOpen}
        timezones={timezones}
        presetName={presetActions.presetName}
        presetDescription={presetActions.presetDescription}
        onPresetNameChange={presetActions.setPresetName}
        onPresetDescriptionChange={presetActions.setPresetDescription}
        onSave={presetActions.handleSavePreset}
      />
      <CalendarExportDialog
        open={calendarExport.isExportDialogOpen}
        onOpenChange={calendarExport.setIsExportDialogOpen}
        exportSlotData={calendarExport.exportSlotData}
        exportEventTitle={calendarExport.exportEventTitle}
        exportStartTime={calendarExport.exportStartTime}
        exportDuration={calendarExport.exportDuration}
        onEventTitleChange={calendarExport.setExportEventTitle}
        onStartTimeChange={calendarExport.setExportStartTime}
        onDurationChange={calendarExport.setExportDuration}
        onExport={calendarExport.handleExportCalendar}
        onCancel={calendarExport.handleExportDialogClose}
      />
    </div>
  );
}
