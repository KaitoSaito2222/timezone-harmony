import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetName?: string;
  isSubmitting: boolean;
  onDelete: () => void;
}

export function DeletePresetDialog({
  open,
  onOpenChange,
  presetName,
  isSubmitting,
  onDelete,
}: DeletePresetDialogProps) {
  const t = useTranslations('presets');

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deletePreset')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirm', { name: presetName ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
