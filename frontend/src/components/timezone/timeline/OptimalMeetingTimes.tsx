'use client';
import { useTranslations } from 'next-intl';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OptimalTime } from '@/lib/timeline';

interface OptimalMeetingTimesProps {
  optimalTimes: OptimalTime[];
  getDisplayName: (identifier: string) => string;
}

export function OptimalMeetingTimes({ optimalTimes, getDisplayName }: OptimalMeetingTimesProps) {
  const t = useTranslations('timezone');

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
            {optimalTimes.map((opt, index) => (
              <Badge key={index} variant="outline" className="px-3 py-2 text-sm">
                {opt.times.map((t) => `${getDisplayName(t.timezone)}: ${t.time}`).join(' | ')}
              </Badge>
            ))}
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
