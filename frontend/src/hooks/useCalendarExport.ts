import { useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { calendarService } from '@/services/calendar.service';
import { generateTimeSlots } from '@/lib/timeline';
import type { BusinessHoursMap } from '@/lib/timeline';
import { getTimezoneCity } from '@/lib/timezone-utils';
import { toast } from 'sonner';

export type CalendarExportMethod = 'ics' | 'google' | 'outlook';

export interface ExportSlotData {
  rowIndex: number;
  slots: { timezone: string; time: DateTime }[];
}

interface UseCalendarExportParams {
  timezones: string[];
  businessHours: BusinessHoursMap;
  baseTime: DateTime;
  showBusinessHours: boolean;
  setSelectedRow: (row: number | null) => void;
}

export function useCalendarExport({
  timezones,
  businessHours,
  baseTime,
  showBusinessHours,
  setSelectedRow,
}: UseCalendarExportParams) {
  const t = useTranslations('timezone');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportSlotData, setExportSlotData] = useState<ExportSlotData | null>(null);
  const [exportEventTitle, setExportEventTitle] = useState('Meeting');
  const [exportDuration, setExportDuration] = useState(60);

  const handleTimeSlotClick = (rowIndex: number) => {
    const slotData = timezones.map((tz) => {
      const tzBH = businessHours[tz];
      const slots = generateTimeSlots(
        tz,
        baseTime,
        tzBH?.startTime || null,
        tzBH?.endTime || null,
        showBusinessHours
      );
      return { timezone: tz, time: slots[rowIndex].fullTime };
    });
    setExportSlotData({ rowIndex, slots: slotData });
    setSelectedRow(rowIndex);
    setIsExportDialogOpen(true);
  };

  const buildDescription = (slots: ExportSlotData['slots']) =>
    slots
      .map((s) => `${getTimezoneCity(s.timezone)}: ${s.time.toFormat('MMM dd, HH:mm')}`)
      .join('\n');

  const handleExportCalendar = async (method: CalendarExportMethod) => {
    if (!exportSlotData) return;
    const startTime = exportSlotData.slots[0].time;
    const endTime = startTime.plus({ minutes: exportDuration });
    const description = buildDescription(exportSlotData.slots);

    if (method === 'google') {
      const fmt = (dt: DateTime) => dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: exportEventTitle,
        dates: `${fmt(startTime)}/${fmt(endTime)}`,
        details: description,
      });
      window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
      toast.success(t('calendarToastGoogle'));
      setIsExportDialogOpen(false);
      setSelectedRow(null);
      return;
    }

    if (method === 'outlook') {
      const params = new URLSearchParams({
        subject: exportEventTitle,
        startdt: startTime.toUTC().toISO() || '',
        enddt: endTime.toUTC().toISO() || '',
        body: description,
      });
      window.open(
        `https://outlook.live.com/calendar/0/deeplink/compose?${params}`,
        '_blank'
      );
      toast.success(t('calendarToastOutlook'));
      setIsExportDialogOpen(false);
      setSelectedRow(null);
      return;
    }

    // ICS download (default)
    try {
      const blob = await calendarService.exportToICS({
        title: exportEventTitle,
        startTime: startTime.toISO() || '',
        duration: exportDuration,
        timezones: exportSlotData.slots.map((slot) => ({
          timezone: getTimezoneCity(slot.timezone),
          localTime: slot.time.toFormat('MMM dd, HH:mm'),
        })),
      });
      const filename = `${exportEventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
      calendarService.downloadICS(blob, filename);
      toast.success(t('calendarToastExported'));
      setIsExportDialogOpen(false);
      setExportEventTitle('Meeting');
      setSelectedRow(null);
    } catch {
      toast.error(t('calendarToastFailed'));
    }
  };

  const handleExportDialogClose = () => {
    setIsExportDialogOpen(false);
    setSelectedRow(null);
  };

  return {
    isExportDialogOpen,
    setIsExportDialogOpen,
    exportSlotData,
    exportEventTitle,
    setExportEventTitle,
    exportDuration,
    setExportDuration,
    handleTimeSlotClick,
    handleExportCalendar,
    handleExportDialogClose,
  };
}
