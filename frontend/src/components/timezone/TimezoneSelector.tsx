'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TimezoneSelectorContent } from './TimezoneSelectorContent';

interface TimezoneSelectorProps {
  onSelect: (identifier: string) => void;
  onClose: () => void;
  excludeTimezones?: string[];
}

export function TimezoneSelector({
  onSelect,
  onClose,
  excludeTimezones = [],
}: TimezoneSelectorProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[80vh] flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Select Timezone</DialogTitle>
        </DialogHeader>
        <TimezoneSelectorContent
          onSelect={onSelect}
          excludeTimezones={excludeTimezones}
        />
      </DialogContent>
    </Dialog>
  );
}
