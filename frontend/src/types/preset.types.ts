export interface TimezonePresetItem {
  id: string;
  timezoneIdentifier: string;
  displayLabel: string | null;
  position: number;
  startTime: string | null;
  endTime: string | null;
}

export interface TimezonePreset {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  items: TimezonePresetItem[];
  createdAt: string;
  updatedAt: string;
}
