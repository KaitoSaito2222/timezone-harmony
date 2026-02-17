import { useState } from 'react';
import { DateTime } from 'luxon';
import { calendarService } from '@/services/calendar.service';
import { generateTimeSlots } from '@/lib/timeline';
import type { BusinessHoursMap } from '@/lib/timeline';
import { toast } from 'sonner';

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

  const handleExportCalendar = async () => {
    if (!exportSlotData) return;
    try {
      const startTime = exportSlotData.slots[0].time;
      const blob = await calendarService.exportToICS({
        title: exportEventTitle,
        startTime: startTime.toISO() || '',
        duration: exportDuration,
        timezones: exportSlotData.slots.map((slot) => ({
          timezone: slot.timezone.split('/')[1]?.replace(/_/g, ' ') || slot.timezone,
          localTime: slot.time.toFormat('MMM dd, HH:mm'),
        })),
      });
      const filename = `${exportEventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
      calendarService.downloadICS(blob, filename);
      toast.success('Calendar event exported!');
      setIsExportDialogOpen(false);
      setExportEventTitle('Meeting');
      setSelectedRow(null);
    } catch {
      toast.error('Failed to export calendar event');
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
