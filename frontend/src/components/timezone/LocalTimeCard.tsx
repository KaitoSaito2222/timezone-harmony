'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { MapPin, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTimezoneCity } from '@/lib/timezone-utils';

export function LocalTimeCard() {
  const t = useTranslations('timezone');
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const [isVisible, setIsVisible] = useLocalStorage<boolean>('localTimeCard_visible', true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setCurrentTime(DateTime.local());
    const interval = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timezone = currentTime?.zoneName ?? null;
  const cityName = timezone ? getTimezoneCity(timezone) : t('local');
  const offset = currentTime?.toFormat('ZZZZ') ?? null;

  if (!isVisible) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="text-muted-foreground"
        >
          <Eye className="h-4 w-4 mr-1" />
          {t('showLocalTime')}
        </Button>
      </div>
    );
  }

  return (
    <Card className="gap-1 sm:gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {t('localTimezone')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className='ml-2'>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm sm:text-base">{cityName}</span>
              <span className="text-xs text-muted-foreground">{offset}</span>
            </div>
            {isExpanded && (
              <p className="text-xs text-muted-foreground">{timezone}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-mono font-bold tabular-nums">
                {currentTime ? currentTime.toFormat('HH:mm:ss') : '--:--:--'}
              </div>
              {isExpanded && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentTime ? currentTime.toFormat('cccc, MMMM d, yyyy') : ''}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setIsVisible(false)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
