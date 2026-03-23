'use client';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('timezone');

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="max-h-[92vh] flex flex-col gap-2 rounded-t-xl px-4 pb-8">
          <SheetHeader className="px-0 pt-3 pb-0">
            <SheetTitle>{t('selectTimezone')}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TimezoneSelectorContent
              onSelect={onSelect}
              excludeTimezones={excludeTimezones}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] flex flex-col gap-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('selectTimezone')}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <TimezoneSelectorContent
            onSelect={onSelect}
            excludeTimezones={excludeTimezones}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
