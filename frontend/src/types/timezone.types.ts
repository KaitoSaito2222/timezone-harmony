export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  region?: string | null;
}

export interface CurrentTimeInfo {
  timezone: string;
  currentTime: string;
  offset: string;
}
