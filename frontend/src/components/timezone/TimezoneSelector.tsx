'use client';
import { useTranslations } from 'next-intl';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
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
  const t = useTranslations('timezone');

  return (
    <ResponsiveDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={t('selectTimezone')}
      dialogClassName="max-w-lg max-h-[90vh] flex flex-col gap-3"
      sheetClassName="max-h-[92vh] flex flex-col gap-2 rounded-t-xl px-4 pb-8"
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        <TimezoneSelectorContent
          onSelect={onSelect}
          excludeTimezones={excludeTimezones}
        />
      </div>
    </ResponsiveDialog>
  );
}
