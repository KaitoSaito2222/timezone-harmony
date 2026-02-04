export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  country?: string;
}

export interface CurrentTimeInfo {
  timezone: string;
  currentTime: string;
  offset: string;
}
