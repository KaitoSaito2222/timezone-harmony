'use client';
import { useCallback } from 'react';
import { DateTime } from 'luxon';
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
}

export function TimezoneComparison({
  timezones,
  onAddTimezone,
  onRemoveTimezone,
}: TimezoneComparisonProps) {
  const { allTimezones, businessHours } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();

  const getDisplayName = useCallback(
    (identifier: string): string => {
      const tz = allTimezones.find((t) => t.identifier === identifier);
      return tz?.displayName ?? identifier.split('/')[1]?.replace(/_/g, ' ') ?? identifier;
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
    allTimezones
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
            isAuthenticated={isAuthenticated}
            presets={presetActions.presets}
            onLoadPreset={presetActions.handleLoadPreset}
            onOpenSaveDialog={() => presetActions.setIsSaveDialogOpen(true)}
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
              <h3 className="text-xl font-semibold mb-2">No Timezones Selected</h3>
              <p className="text-muted-foreground mb-6">
                Click &quot;Add Timezone&quot; to start comparing times across different regions
              </p>
              <Button onClick={onAddTimezone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Timezone
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Click slot to export to calendar</span>
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

      {timezones.length > 0 && <OptimalMeetingTimes optimalTimes={optimalTimes} />}

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
        exportDuration={calendarExport.exportDuration}
        onEventTitleChange={calendarExport.setExportEventTitle}
        onDurationChange={calendarExport.setExportDuration}
        onExport={calendarExport.handleExportCalendar}
        onCancel={calendarExport.handleExportDialogClose}
      />
    </div>
  );
}
