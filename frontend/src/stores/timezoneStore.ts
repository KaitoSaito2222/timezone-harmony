import { create } from 'zustand';
import type { TimezoneInfo } from '@/types/timezone.types';
import type { TimezonePreset } from '@/types/preset.types';
import { timezoneService } from '@/services/timezone.service';
import { presetService } from '@/services/preset.service';

interface BusinessHoursMap {
  [timezoneIdentifier: string]: {
    startTime: string | null;
    endTime: string | null;
  };
}

interface TimezoneState {
  allTimezones: TimezoneInfo[];
  popularTimezones: TimezoneInfo[];
  presets: TimezonePreset[];
  selectedTimezones: string[];
  businessHours: BusinessHoursMap;
  isLoading: boolean;
  loadTimezones: () => Promise<void>;
  loadPresets: () => Promise<void>;
  addTimezone: (identifier: string) => void;
  removeTimezone: (identifier: string) => void;
  setSelectedTimezones: (timezones: string[], businessHours?: BusinessHoursMap) => void;
  loadPreset: (preset: TimezonePreset) => void;
}

export const useTimezoneStore = create<TimezoneState>((set, get) => ({
  allTimezones: [],
  popularTimezones: [],
  presets: [],
  selectedTimezones: [],
  businessHours: {},
  isLoading: false,

  loadTimezones: async () => {
    set({ isLoading: true });
    try {
      const [all, popular] = await Promise.all([
        timezoneService.getAll(),
        timezoneService.getPopular(),
      ]);
      set({ allTimezones: all, popularTimezones: popular, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load timezones:', error);
    }
  },

  loadPresets: async () => {
    try {
      const presets = await presetService.getAll();
      set({ presets });
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  },

  addTimezone: (identifier: string) => {
    const { selectedTimezones } = get();
    if (!selectedTimezones.includes(identifier)) {
      set({ selectedTimezones: [...selectedTimezones, identifier] });
    }
  },

  removeTimezone: (identifier: string) => {
    const { selectedTimezones } = get();
    set({
      selectedTimezones: selectedTimezones.filter((tz) => tz !== identifier),
    });
  },

  setSelectedTimezones: (timezones: string[], businessHours?: BusinessHoursMap) => {
    set({ selectedTimezones: timezones, businessHours: businessHours || {} });
  },

  loadPreset: (preset: TimezonePreset) => {
    const timezones = preset.timezones
      .sort((a, b) => a.position - b.position)
      .map((tz) => tz.timezoneIdentifier);

    const businessHours: BusinessHoursMap = {};
    preset.timezones.forEach((tz) => {
      if (tz.startTime || tz.endTime) {
        businessHours[tz.timezoneIdentifier] = {
          startTime: tz.startTime,
          endTime: tz.endTime,
        };
      }
    });

    set({ selectedTimezones: timezones, businessHours });
  },
}));
