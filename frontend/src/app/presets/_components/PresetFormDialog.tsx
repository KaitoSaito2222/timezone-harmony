import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { PresetFormData } from '../_hooks/usePresetsData';

interface PresetFormDialogProps {
  open: boolean;
  isEdit: boolean;
  formData: PresetFormData;
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
  getTimezoneName: (identifier: string) => string;
  getTimezoneOffset: (identifier: string) => string;
}

export function PresetFormDialog({
  open,
  isEdit,
  formData,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel,
  onAddTimezone,
  onRemoveTimezone,
  onUpdateTimezoneHours,
  getTimezoneName,
  getTimezoneOffset,
}: PresetFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Preset' : 'Create New Preset'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g., Team Meeting"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="e.g., Weekly sync with US and EU teams"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Timezones</Label>
              <Button variant="outline" size="sm" onClick={onAddTimezone}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            {formData.timezones.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No timezones added yet
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
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground whitespace-nowrap">
                        Business Hours:
                      </span>
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
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>{isEdit ? 'Save Changes' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
