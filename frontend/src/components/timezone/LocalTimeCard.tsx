import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { MapPin, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'localTimeCard_visible';

export function LocalTimeCard() {
  const [currentTime, setCurrentTime] = useState(DateTime.local());
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== 'false';
  });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isVisible));
  }, [isVisible]);

  const timezone = currentTime.zoneName;
  const cityName = timezone?.split('/').pop()?.replace(/_/g, ' ') || 'Local';
  const offset = currentTime.toFormat('ZZZZ');

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
          Show Local Time
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm sm:text-base">{cityName}</span>
                <span className="text-xs text-muted-foreground">{offset}</span>
              </div>
              {isExpanded && (
                <p className="text-xs text-muted-foreground">{timezone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-mono font-bold tabular-nums">
                {currentTime.toFormat('HH:mm:ss')}
              </div>
              {isExpanded && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentTime.toFormat('cccc, MMMM d, yyyy')}
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
