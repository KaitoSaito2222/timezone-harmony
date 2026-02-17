import { Calendar } from 'lucide-react';
import { DateTime } from 'luxon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  onExport: () => void;
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
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Export to Calendar
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export this time slot as a calendar event (.ics file).
            You can import it into Google Calendar, Outlook, Apple Calendar, etc.
          </p>
          {exportSlotData && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium">Selected Time:</p>
              <div className="space-y-1">
                {exportSlotData.slots.map((slot) => (
                  <div key={slot.timezone} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {slot.timezone.split('/')[1]?.replace(/_/g, ' ') || slot.timezone}
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
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              value={exportEventTitle}
              onChange={(e) => onEventTitleChange(e.target.value)}
              placeholder="e.g., Team Meeting"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-duration">Duration (minutes)</Label>
            <select
              id="event-duration"
              value={exportDuration}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onExport}>
            <Calendar className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
