import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { presetService } from '@/services/preset.service';
import type { TimezonePreset } from '@/types/preset.types';
import { toast } from 'sonner';

export interface TimezoneFormItem {
  timezoneIdentifier: string;
  displayLabel?: string;
  startTime?: string;
  endTime?: string;
}

export interface PresetFormData {
  name: string;
  description: string;
  timezones: TimezoneFormItem[];
}

const INITIAL_FORM: PresetFormData = { name: '', description: '', timezones: [] };

export function usePresetsData() {
  const router = useRouter();
  const { loadPreset, allTimezones, loadTimezones } = useTimezoneStore();
  const [presets, setPresets] = useState<TimezonePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<TimezonePreset | null>(null);
  const [formData, setFormData] = useState<PresetFormData>(INITIAL_FORM);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPresets();
    if (allTimezones.length === 0) loadTimezones();
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

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedPreset(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Preset name is required');
      return false;
    }
    if (formData.timezones.length === 0) {
      toast.error('Add at least one timezone');
      return false;
    }
    for (const tz of formData.timezones) {
      const hasStart = !!tz.startTime;
      const hasEnd = !!tz.endTime;
      if (hasStart !== hasEnd) {
        toast.error(`Business hours require both start and end time (${getTimezoneName(tz.timezoneIdentifier)})`);
        return false;
      }
      if (hasStart && hasEnd && tz.startTime! >= tz.endTime!) {
        toast.error(`End time must be after start time (${getTimezoneName(tz.timezoneIdentifier)})`);
        return false;
      }
    }
    return true;
  };

  const buildTimezonePayload = (timezones: TimezoneFormItem[]) =>
    timezones.map((tz, index) => ({
      timezoneIdentifier: tz.timezoneIdentifier,
      displayLabel: tz.displayLabel,
      position: index,
      startTime: tz.startTime || undefined,
      endTime: tz.endTime || undefined,
    }));

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await presetService.create({
        name: formData.name,
        description: formData.description || undefined,
        timezones: buildTimezonePayload(formData.timezones),
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
    if (!validateForm()) return;
    try {
      await presetService.update(selectedPreset.id, {
        name: formData.name,
        description: formData.description || undefined,
        timezones: buildTimezonePayload(formData.timezones),
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
    router.push('/');
  };

  const openEditDialog = (preset: TimezonePreset) => {
    setSelectedPreset(preset);
    setFormData({
      name: preset.name,
      description: preset.description || '',
      timezones: preset.items.map((tz) => ({
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

  const updateTimezoneHours = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
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

  const formatHoursDisplay = (
    startTime: string | null,
    endTime: string | null
  ): string | null => {
    if (startTime && endTime) return `${startTime}-${endTime}`;
    return null;
  };

  return {
    presets,
    loading,
    selectedPreset,
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSelectorOpen,
    setIsSelectorOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleFavorite,
    handleLoadPreset,
    openEditDialog,
    openDeleteDialog,
    resetForm,
    addTimezone,
    removeTimezone,
    updateTimezoneHours,
    getTimezoneName,
    getTimezoneOffset,
    formatHoursDisplay,
  };
}
