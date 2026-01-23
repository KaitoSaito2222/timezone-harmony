export interface PresetTimezone {
  id: string;
  timezoneIdentifier: string;
  displayLabel: string | null;
  position: number;
}

export interface TimezonePreset {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  timezones: PresetTimezone[];
  createdAt: string;
  updatedAt: string;
}
