'use client';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { getTimezoneCity } from '@/lib/timezone-utils';
import type { CalendarExportMethod } from '@/hooks/useCalendarExport';

interface ExportSlotData {
  rowIndex: number;
  slots: { timezone: string; time: DateTime }[];
}

interface CalendarExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportSlotData: ExportSlotData | null;
  exportEventTitle: string;
  exportDuration: number;
  onEventTitleChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onExport: (method: CalendarExportMethod) => void;
  onCancel: () => void;
}

export function CalendarExportDialog({
  open,
  onOpenChange,
  exportSlotData,
  exportEventTitle,
  exportDuration,
  onEventTitleChange,
  onDurationChange,
  onExport,
  onCancel,
}: CalendarExportDialogProps) {
  const t = useTranslations('timezone');

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onCancel();
    else onOpenChange(true);
  };

  const title = (
    <>
      <Calendar className="h-5 w-5 text-primary" />
      {t('calendarExportTitle')}
    </>
  );

  const footer = (
    <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
      {t('cancel')}
    </Button>
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      footer={footer}
      dialogClassName="max-w-md min-h-120"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('calendarExportDesc')}</p>
        {exportSlotData && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium">{t('calendarSelectedTime')}</p>
            <div className="space-y-1">
              {exportSlotData.slots.map((slot) => (
                <div key={slot.timezone} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {getTimezoneCity(slot.timezone)}
                  </span>
                  <span className="font-mono font-medium">
                    {slot.time.toFormat('MMM dd, HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="event-title">{t('calendarEventTitle')}</Label>
          <Input
            id="event-title"
            value={exportEventTitle}
            onChange={(e) => onEventTitleChange(e.target.value)}
            placeholder={t('calendarEventTitlePlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-duration">{t('calendarDuration')}</Label>
          <select
            id="event-duration"
            value={exportDuration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value={15}>{t('calendarDuration15')}</option>
            <option value={30}>{t('calendarDuration30')}</option>
            <option value={45}>{t('calendarDuration45')}</option>
            <option value={60}>{t('calendarDuration60')}</option>
            <option value={90}>{t('calendarDuration90')}</option>
            <option value={120}>{t('calendarDuration120')}</option>
          </select>
        </div>
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onExport('google')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-background hover:bg-muted/50 transition-colors text-sm"
          >
            <div className="flex items-center gap-3">
              <Image src="/icons/google-calendar.svg" alt="Google Calendar" width={16} height={16} className="shrink-0" />
              <span className="font-medium">{t('calendarOpenGoogle')}</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
          <button
            onClick={() => onExport('outlook')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-background hover:bg-muted/50 transition-colors text-sm"
          >
            <div className="flex items-center gap-3">
              <Image src="/icons/outlook.svg" alt="Outlook" width={16} height={16} className="shrink-0" />
              <span className="font-medium">{t('calendarOpenOutlook')}</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
          <button
            onClick={() => onExport('ics')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-background hover:bg-muted/50 transition-colors text-sm"
          >
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4 text-primary shrink-0" />
              <div className="text-left">
                <p className="font-medium">{t('calendarDownloadIcs')}</p>
                <p className="text-xs text-muted-foreground">{t('calendarDownloadIcsDesc')}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
