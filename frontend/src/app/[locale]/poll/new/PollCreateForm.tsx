'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DATETIME_LOCAL_FORMAT } from '@/lib/constants';
import { isInBusinessHours } from '@/lib/timeline';
import { trackEvent } from '@/lib/analytics';
import { pollService } from '@/services/poll.service';
import { rememberPoll } from '@/lib/saved-polls';

const MAX_OPTIONS = 10;

/** Picks up to 3 upcoming days' first hour that is within business hours in every zone. */
function suggestCandidates(zones: string[]): string[] {
  const base = zones[0];
  const start = DateTime.now().setZone(base).plus({ days: 1 }).startOf('day');
  const result: string[] = [];
  for (let d = 0; d < 7 && result.length < 3; d++) {
    for (let h = 0; h < 24; h++) {
      const slot = start.plus({ days: d, hours: h });
      if (zones.every(z => isInBusinessHours(slot.setZone(z).hour, null, null))) {
        result.push(slot.toFormat(DATETIME_LOCAL_FORMAT));
        break;
      }
    }
  }
  return result.length > 0 ? result : [start.plus({ hours: 13 }).toFormat(DATETIME_LOCAL_FORMAT)];
}

export function PollCreateForm() {
  const t = useTranslations('poll');
  const router = useRouter();
  const [zones, setZones] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tz = new URLSearchParams(window.location.search).get('tz');
    const parsed = (tz ? tz.split(',').map(decodeURIComponent).filter(Boolean) : []).slice(0, 5);
    const valid = parsed.filter(z => DateTime.now().setZone(z).isValid);
    const resolved = valid.length > 0 ? valid : [DateTime.local().zoneName ?? 'UTC'];
    setZones(resolved);
    setCandidates(suggestCandidates(resolved));
  }, []);

  const baseZone = zones[0];

  const submit = async () => {
    if (!title.trim()) {
      toast.error(t('titleRequired'));
      return;
    }
    const options = candidates
      .filter(Boolean)
      .map(c => DateTime.fromFormat(c, DATETIME_LOCAL_FORMAT, { zone: baseZone }))
      .filter(dt => dt.isValid)
      .map(dt => dt.toUTC().toISO()!);
    if (options.length === 0) {
      toast.error(t('optionRequired'));
      return;
    }
    setSubmitting(true);
    try {
      const poll = await pollService.create({
        title: title.trim(),
        timezones: zones,
        durationMinutes: duration,
        options,
      });
      rememberPoll(poll, true);
      trackEvent('poll_created', { options: options.length, timezones: zones.length });
      router.push(`/poll/${poll.id}`);
    } catch {
      toast.error(t('createFailed'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t('createTitle')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('createDesc')}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="poll-title">{t('titleLabel')}</Label>
            <Input
              id="poll-title"
              value={title}
              maxLength={120}
              placeholder={t('titlePlaceholder')}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poll-duration">{t('durationLabel')}</Label>
            <select
              id="poll-duration"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
            >
              {[30, 45, 60, 90, 120].map(m => (
                <option key={m} value={m}>
                  {m} {t('minutes')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>{t('candidatesLabel')}</Label>
            {baseZone && (
              <p className="text-xs text-muted-foreground">{t('candidatesZone', { zone: baseZone })}</p>
            )}
            {candidates.map((value, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={value}
                  onChange={e => setCandidates(prev => prev.map((v, j) => (j === i ? e.target.value : v)))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('removeOption')}
                  disabled={candidates.length <= 1}
                  onClick={() => setCandidates(prev => prev.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {candidates.length < MAX_OPTIONS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCandidates(prev => {
                    // Suggest the day after the last entry; fall back to tomorrow when it is empty or invalid.
                    const last = DateTime.fromFormat(prev[prev.length - 1] ?? '', DATETIME_LOCAL_FORMAT);
                    const next = (last.isValid ? last : DateTime.now()).plus({ days: 1 });
                    return [...prev, next.toFormat(DATETIME_LOCAL_FORMAT)];
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {t('addOption')}
              </Button>
            )}
          </div>

          <Button onClick={submit} disabled={submitting || zones.length === 0} className="w-full">
            {t('createButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
