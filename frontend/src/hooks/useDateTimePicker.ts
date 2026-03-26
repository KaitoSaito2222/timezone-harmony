import { useState, useRef, useEffect } from 'react';
import { DateTime } from 'luxon';
import { DATETIME_LOCAL_FORMAT } from '@/lib/constants';

export function useDateTimePicker(timezones: string[]) {
  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    () => DateTime.now().toFormat(DATETIME_LOCAL_FORMAT)
  );
  const [baseTimezone, setBaseTimezone] = useState<string>('local');
  const isLiveMode = useRef(true);
  const hasInitializedBaseTimezone = useRef(false);

  useEffect(() => {
    if (isLiveMode.current) {
      setSelectedDateTime(
        baseTimezone === 'local'
          ? DateTime.now().toFormat(DATETIME_LOCAL_FORMAT)
          : DateTime.now().setZone(baseTimezone).toFormat(DATETIME_LOCAL_FORMAT)
      );
    }

    const interval = setInterval(() => {
      if (isLiveMode.current) {
        const nowStr =
          baseTimezone === 'local'
            ? DateTime.now().toFormat(DATETIME_LOCAL_FORMAT)
            : DateTime.now().setZone(baseTimezone).toFormat(DATETIME_LOCAL_FORMAT);
        setSelectedDateTime((prev) => (prev !== nowStr ? nowStr : prev));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [baseTimezone]);

  useEffect(() => {
    if (!hasInitializedBaseTimezone.current && timezones.length > 0) {
      hasInitializedBaseTimezone.current = true;
      setBaseTimezone(timezones[0]);
    }
  }, [timezones]);

  const handleDateTimeChange = (value: string) => {
    if (!value) {
      isLiveMode.current = true;
      const resetTz = timezones[0] || 'local';
      setSelectedDateTime(
        resetTz === 'local'
          ? DateTime.now().toFormat(DATETIME_LOCAL_FORMAT)
          : DateTime.now().setZone(resetTz).toFormat(DATETIME_LOCAL_FORMAT)
      );
      return;
    }
    isLiveMode.current = false;
    setSelectedDateTime(value);
  };

  const handleReset = () => {
    isLiveMode.current = true;
    hasInitializedBaseTimezone.current = true;
    const resetTz = timezones[0] || 'local';
    setSelectedDateTime(
      resetTz === 'local'
        ? DateTime.now().toFormat(DATETIME_LOCAL_FORMAT)
        : DateTime.now().setZone(resetTz).toFormat(DATETIME_LOCAL_FORMAT)
    );
    setBaseTimezone(resetTz);
  };

  const selectedDT =
    baseTimezone === 'local'
      ? DateTime.fromISO(selectedDateTime)
      : DateTime.fromISO(selectedDateTime, { zone: baseTimezone });
  const baseTime = selectedDT.startOf('hour');
  const isNow = isLiveMode.current;

  return {
    selectedDateTime,
    baseTimezone,
    setBaseTimezone,
    handleDateTimeChange,
    handleReset,
    selectedDT,
    baseTime,
    isNow,
    isLiveMode,
  };
}
