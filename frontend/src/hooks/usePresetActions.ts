import { useState, useEffect } from 'react';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { presetService } from '@/services/preset.service';
import type { TimezonePreset } from '@/types/preset.types';
import { toast } from 'sonner';
import { useSubmitGuard } from './useSubmitGuard';

export function usePresetActions(timezones: string[], isAuthenticated: boolean) {
  const { loadPreset: loadPresetToStore } = useTimezoneStore();
  const [presets, setPresets] = useState<TimezonePreset[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const guard = useSubmitGuard();

  const loadPresets = async () => {
    try {
      const data = await presetService.getAll();
      setPresets(data);
    } catch {
      // Silently fail - presets are optional
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadPresets();
  }, [isAuthenticated]);

  const handleLoadPreset = (preset: TimezonePreset) => {
    loadPresetToStore(preset);
    toast.success(`Loaded "${preset.name}"`);
  };

  const handleSavePreset = () => guard(async () => {
    if (!presetName.trim()) {
      toast.error('Preset name is required');
      return;
    }
    if (timezones.length === 0) {
      toast.error('Add at least one timezone first');
      return;
    }
    await presetService.create({
      name: presetName,
      description: presetDescription || undefined,
      timezones: timezones.map((tz, index) => ({
        timezoneIdentifier: tz,
        position: index,
      })),
    });
    toast.success('Preset saved!');
    setIsSaveDialogOpen(false);
    setPresetName('');
    setPresetDescription('');
    loadPresets();
  });

  return {
    presets,
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    presetName,
    setPresetName,
    presetDescription,
    setPresetDescription,
    handleLoadPreset,
    handleSavePreset,
  };
}
