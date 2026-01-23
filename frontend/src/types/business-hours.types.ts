export interface BusinessHours {
  id: string;
  timezoneIdentifier: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
