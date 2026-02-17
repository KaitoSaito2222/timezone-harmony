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
  onDelete: () => void;
}

export function DeletePresetDialog({
  open,
  onOpenChange,
  presetName,
  onDelete,
}: DeletePresetDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Preset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{presetName}&quot;?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
