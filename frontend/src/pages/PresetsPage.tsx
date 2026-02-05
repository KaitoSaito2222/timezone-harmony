import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Trash2, Edit, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TimezoneSelector } from '@/components/timezone/TimezoneSelector';
import { presetService } from '@/services/preset.service';
import { useTimezoneStore } from '@/stores/timezoneStore';
import type { TimezonePreset } from '@/types/preset.types';
import { toast } from 'sonner';

interface TimezoneFormItem {
  timezoneIdentifier: string;
  displayLabel?: string;
  startTime?: string;
  endTime?: string;
}

interface PresetFormData {
  name: string;
  description: string;
  timezones: TimezoneFormItem[];
}

export function PresetsPage() {
  const navigate = useNavigate();
  const { loadPreset, allTimezones } = useTimezoneStore();
  const [presets, setPresets] = useState<TimezonePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<TimezonePreset | null>(null);
  const [formData, setFormData] = useState<PresetFormData>({
    name: '',
    description: '',
    timezones: [],
  });

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await presetService.getAll();
      setPresets(data);
    } catch {
      toast.error('Failed to load presets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Preset name is required');
      return;
    }
    if (formData.timezones.length === 0) {
      toast.error('Add at least one timezone');
      return;
    }

    try {
      await presetService.create({
        name: formData.name,
        description: formData.description || undefined,
        timezones: formData.timezones.map((tz, index) => ({
          timezoneIdentifier: tz.timezoneIdentifier,
          displayLabel: tz.displayLabel,
          position: index,
          startTime: tz.startTime || undefined,
          endTime: tz.endTime || undefined,
        })),
      });
      toast.success('Preset created');
      setIsCreateDialogOpen(false);
      resetForm();
      loadPresets();
    } catch {
      toast.error('Failed to create preset');
    }
  };

  const handleUpdate = async () => {
    if (!selectedPreset) return;
    if (!formData.name.trim()) {
      toast.error('Preset name is required');
      return;
    }

    try {
      await presetService.update(selectedPreset.id, {
        name: formData.name,
        description: formData.description || undefined,
        timezones: formData.timezones.map((tz, index) => ({
          timezoneIdentifier: tz.timezoneIdentifier,
          displayLabel: tz.displayLabel,
          position: index,
          startTime: tz.startTime || undefined,
          endTime: tz.endTime || undefined,
        })),
      });
      toast.success('Preset updated');
      setIsEditDialogOpen(false);
      resetForm();
      loadPresets();
    } catch {
      toast.error('Failed to update preset');
    }
  };

  const handleDelete = async () => {
    if (!selectedPreset) return;

    try {
      await presetService.delete(selectedPreset.id);
      toast.success('Preset deleted');
      setIsDeleteDialogOpen(false);
      setSelectedPreset(null);
      loadPresets();
    } catch {
      toast.error('Failed to delete preset');
    }
  };

  const handleToggleFavorite = async (preset: TimezonePreset) => {
    try {
      await presetService.toggleFavorite(preset.id);
      loadPresets();
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleLoadPreset = (preset: TimezonePreset) => {
    loadPreset(preset);
    toast.success(`Loaded "${preset.name}"`);
    navigate('/');
  };

  const openEditDialog = (preset: TimezonePreset) => {
    setSelectedPreset(preset);
    setFormData({
      name: preset.name,
      description: preset.description || '',
      timezones: preset.timezones.map((tz) => ({
        timezoneIdentifier: tz.timezoneIdentifier,
        displayLabel: tz.displayLabel || undefined,
        startTime: tz.startTime || undefined,
        endTime: tz.endTime || undefined,
      })),
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (preset: TimezonePreset) => {
    setSelectedPreset(preset);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', timezones: [] });
    setSelectedPreset(null);
  };

  const addTimezone = (identifier: string) => {
    setFormData((prev) => ({
      ...prev,
      timezones: [...prev.timezones, { timezoneIdentifier: identifier }],
    }));
    setIsSelectorOpen(false);
  };

  const removeTimezone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timezones: prev.timezones.filter((_, i) => i !== index),
    }));
  };

  const updateTimezoneHours = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setFormData((prev) => ({
      ...prev,
      timezones: prev.timezones.map((tz, i) =>
        i === index ? { ...tz, [field]: value || undefined } : tz
      ),
    }));
  };

  const getTimezoneName = (identifier: string) => {
    const tz = allTimezones.find((t) => t.identifier === identifier);
    return tz?.displayName || identifier.split('/').pop()?.replace(/_/g, ' ') || identifier;
  };

  const getTimezoneOffset = (identifier: string) => {
    const tz = allTimezones.find((t) => t.identifier === identifier);
    return tz?.offset || '';
  };

  const formatHoursDisplay = (startTime: string | null, endTime: string | null) => {
    if (startTime && endTime) {
      return `${startTime}-${endTime}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">My Presets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Save and manage your timezone combinations
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Preset
        </Button>
      </div>

      {presets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No presets yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first preset to quickly load your favorite timezone combinations
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Preset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => (
            <Card key={preset.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{preset.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleFavorite(preset)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        preset.isFavorite
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
                {preset.description && (
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {preset.timezones
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 5)
                    .map((tz) => {
                      const hours = formatHoursDisplay(tz.startTime, tz.endTime);
                      return (
                        <Badge key={tz.id} variant="secondary" className="text-xs">
                          {getTimezoneName(tz.timezoneIdentifier)}
                          {hours && <span className="ml-1 opacity-70">({hours})</span>}
                        </Badge>
                      );
                    })}
                  {preset.timezones.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{preset.timezones.length - 5} more
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleLoadPreset(preset)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(preset)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(preset)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Preset' : 'Create New Preset'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Team Meeting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="e.g., Weekly sync with US and EU teams"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Timezones</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelectorOpen(true)}
                >
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
                    <div
                      key={index}
                      className="p-3 bg-muted rounded-lg space-y-2"
                    >
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
                          onClick={() => removeTimezone(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">Business Hours:</span>
                        <Input
                          type="time"
                          value={tz.startTime || ''}
                          onChange={(e) => updateTimezoneHours(index, 'startTime', e.target.value)}
                          className="h-8 w-24"
                          placeholder="Start"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="time"
                          value={tz.endTime || ''}
                          onChange={(e) => updateTimezoneHours(index, 'endTime', e.target.value)}
                          className="h-8 w-24"
                          placeholder="End"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={isEditDialogOpen ? handleUpdate : handleCreate}>
              {isEditDialogOpen ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedPreset?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Timezone Selector */}
      {isSelectorOpen && (
        <TimezoneSelector
          onSelect={addTimezone}
          onClose={() => setIsSelectorOpen(false)}
          excludeTimezones={formData.timezones.map((tz) => tz.timezoneIdentifier)}
        />
      )}
    </div>
  );
}
