import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { getTimezoneCity } from '@/lib/timezone-utils';

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
  const t = useTranslations('timezone');

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {t('cancel')}
      </Button>
      <Button onClick={onSave}>{t('savePreset')}</Button>
    </>
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('saveAsPreset')}
      footer={footer}
      dialogClassName="max-w-md min-h-80"
    >
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
                {getTimezoneCity(tz)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
