import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SavePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timezones: string[];
  presetName: string;
  presetDescription: string;
  onPresetNameChange: (value: string) => void;
  onPresetDescriptionChange: (value: string) => void;
  onSave: () => void;
}

export function SavePresetDialog({
  open,
  onOpenChange,
  timezones,
  presetName,
  presetDescription,
  onPresetNameChange,
  onPresetDescriptionChange,
  onSave,
}: SavePresetDialogProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('timezone');

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="preset-name">{t('presetName')}</Label>
        <Input
          id="preset-name"
          value={presetName}
          onChange={(e) => onPresetNameChange(e.target.value)}
          placeholder={t('presetNamePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preset-description">{t('presetDescriptionOptional')}</Label>
        <Textarea
          id="preset-description"
          value={presetDescription}
          onChange={(e) => onPresetDescriptionChange(e.target.value)}
          placeholder={t('presetDescriptionPlaceholder')}
          rows={2}
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {t('timezonesToSave', { count: timezones.length })}
        <div className="flex flex-wrap gap-1 mt-2">
          {timezones.map((tz) => (
            <Badge key={tz} variant="secondary" className="text-xs">
              {tz.split('/')[1]?.replace(/_/g, ' ') || tz}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="flex flex-col gap-4 rounded-t-xl px-4 pb-8" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader className="px-0 pt-3 pb-0">
            <SheetTitle>{t('saveAsPreset')}</SheetTitle>
          </SheetHeader>
          {content}
          <SheetFooter className="px-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={onSave}>{t('savePreset')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md min-h-80" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('saveAsPreset')}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={onSave}>{t('savePreset')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
