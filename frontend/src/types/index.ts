export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  countries: string[];
}

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

export interface BusinessHours {
  id: string;
  timezoneIdentifier: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CurrentTimeInfo {
  timezone: string;
  currentTime: string;
  offset: string;
}
