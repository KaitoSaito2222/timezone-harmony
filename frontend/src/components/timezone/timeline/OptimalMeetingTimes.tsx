'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { OptimalTime } from '@/lib/timeline';
import { trackEvent } from '@/lib/analytics';

interface OptimalMeetingTimesProps {
  optimalTimes: OptimalTime[];
  getDisplayName: (identifier: string) => string;
}

export function OptimalMeetingTimes({ optimalTimes, getDisplayName }: OptimalMeetingTimesProps) {
  const t = useTranslations('timezone');
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    trackEvent('meeting_time_viewed', { slots: optimalTimes.length });
  }, [optimalTimes.length]);

  if (optimalTimes.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-600" />
            {t('recommendedMeetingTimes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('foundTimeSlots', { count: optimalTimes.length })}
          </p>
          <div className="flex flex-wrap gap-3">
            {optimalTimes.map((opt, index) => {
              const label = opt.times.map((slot) => `${getDisplayName(slot.timezone)}: ${slot.time}`).join(' | ');
              return (
                <button
                  key={index}
                  type="button"
                  title={t('clickToCopy')}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(label);
                      toast.success(t('copiedMeetingTime'));
                      trackEvent('share_text_copied', { source: 'optimal_time' });
                    } catch {
                      // Clipboard unavailable; nothing else to do.
                    }
                  }}
                >
                  <Badge variant="outline" className="px-3 py-2 text-sm cursor-pointer hover:bg-accent">
                    {label}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          {t('noPerfectMatch')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {t('noPerfectMatchDesc')}
        </p>
      </CardContent>
    </Card>
  );
}
