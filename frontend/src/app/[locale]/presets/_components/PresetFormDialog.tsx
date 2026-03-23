import { useTranslations } from 'next-intl';
import { Plus, Trash2, ChevronLeft, Loader2 } from 'lucide-react';
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
import { TimezoneSelectorContent } from '@/components/timezone/TimezoneSelectorContent';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { PresetFormData } from '../_hooks/usePresetsData';

interface PresetFormDialogProps {
  open: boolean;
  isEdit: boolean;
  formData: PresetFormData;
  isSelectorOpen: boolean;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddTimezone: () => void;
  onRemoveTimezone: (index: number) => void;
  onUpdateTimezoneHours: (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => void;
  onSelectTimezone: (identifier: string) => void;
  onCloseSelector: () => void;
  getTimezoneName: (identifier: string) => string;
  getTimezoneOffset: (identifier: string) => string;
}

export function PresetFormDialog({
  open,
  isEdit,
  formData,
  isSelectorOpen,
  isSubmitting,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel,
  onAddTimezone,
  onRemoveTimezone,
  onUpdateTimezoneHours,
  onSelectTimezone,
  onCloseSelector,
  getTimezoneName,
  getTimezoneOffset,
}: PresetFormDialogProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('timezone');
  const tp = useTranslations('presets');

  const selectorContent = (
    <>
      <TimezoneSelectorContent
        onSelect={onSelectTimezone}
        excludeTimezones={formData.timezones.map((tz) => tz.timezoneIdentifier)}
      />
    </>
  );

  const formContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('presetName')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('presetNamePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t('presetDescriptionOptional')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t('presetDescriptionPlaceholder')}
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{tp('timezones')}</Label>
          <Button variant="outline" size="sm" onClick={onAddTimezone}>
            <Plus className="h-3 w-3 mr-1" />
            {tp('add')}
          </Button>
        </div>
        {formData.timezones.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {tp('noTimezonesAdded')}
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {formData.timezones.map((tz, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {getTimezoneName(tz.timezoneIdentifier)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {getTimezoneOffset(tz.timezoneIdentifier)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTimezone(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <span className="text-muted-foreground whitespace-nowrap">
                    {t('workHours')}{' '}
                    <span className="text-xs opacity-70">
                      {tp('businessHoursOf', { name: getTimezoneName(tz.timezoneIdentifier) })}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={tz.startTime || ''}
                      onChange={(e) =>
                        onUpdateTimezoneHours(index, 'startTime', e.target.value)
                      }
                      className="h-8 w-24"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={tz.endTime || ''}
                      onChange={(e) =>
                        onUpdateTimezoneHours(index, 'endTime', e.target.value)
                      }
                      className="h-8 w-24"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col gap-4 rounded-t-xl px-4 pb-8" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader className="px-0 pt-3 pb-0">
            <SheetTitle className="flex items-center gap-2">
              {isSelectorOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onCloseSelector}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {isSelectorOpen ? tp('selectTimezone') : (isEdit ? tp('editPreset') : tp('createNewPreset'))}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isSelectorOpen ? selectorContent : formContent}
          </div>
          {!isSelectorOpen && (
            <SheetFooter className="px-0">
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {tp('cancel')}
              </Button>
              <Button onClick={onSave} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? tp('saveChanges') : tp('create')}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent className="max-w-md h-150 flex flex-col" onOpenAutoFocus={(e) => e.preventDefault()}>
        {isSelectorOpen ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onCloseSelector}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {tp('selectTimezone')}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TimezoneSelectorContent
                onSelect={onSelectTimezone}
                excludeTimezones={formData.timezones.map((tz) => tz.timezoneIdentifier)}
              />
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{isEdit ? tp('editPreset') : tp('createNewPreset')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {formContent}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {tp('cancel')}
              </Button>
              <Button onClick={onSave} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? tp('saveChanges') : tp('create')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
