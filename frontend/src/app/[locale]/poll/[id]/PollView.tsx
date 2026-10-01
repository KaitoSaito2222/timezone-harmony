'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { Check, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUniqueCityNameByIdentifier } from '@/lib/cities';
import { getTimezoneCity } from '@/lib/timezone-utils';
import { trackEvent } from '@/lib/analytics';
import { rememberPoll } from '@/lib/saved-polls';
import { pollService, type MeetingPoll } from '@/services/poll.service';

const NAME_KEY = 'th:poll-voter-name';

function readName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function PollView({ id }: { id: string }) {
  const t = useTranslations('poll');
  const locale = useLocale();
  const [poll, setPoll] = useState<MeetingPoll | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      setPoll(await pollService.get(id));
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    setName(readName());
    load();
  }, [load]);

  // When the typed name matches an earlier voter, pre-check their answers so edits are easy.
  useEffect(() => {
    if (!poll || !name.trim()) return;
    const mine = poll.options.filter(o => o.voters.includes(name.trim())).map(o => o.id);
    if (mine.length > 0) setSelected(new Set(mine));
  }, [poll, name]);

  if (notFound) {
    return <p className="py-16 text-center text-muted-foreground">{t('notFound')}</p>;
  }
  if (!poll) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const zoneName = (zone: string) => getUniqueCityNameByIdentifier(zone, locale) ?? getTimezoneCity(zone);
  const maxVotes = Math.max(0, ...poll.options.map(o => o.voters.length));
  const localZone = DateTime.local().zoneName ?? 'UTC';
  const fmt = (iso: string, zone: string) =>
    DateTime.fromISO(iso, { zone }).setLocale(locale).toFormat('ccc, LLL d · HH:mm');

  const toggle = (optionId: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      return next;
    });

  const submit = async () => {
    const voterName = name.trim();
    if (!voterName) {
      toast.error(t('nameRequired'));
      return;
    }
    setSubmitting(true);
    try {
      setPoll(await pollService.vote(id, voterName, [...selected]));
      try {
        window.localStorage.setItem(NAME_KEY, voterName);
      } catch {
        // Remembering the name is a convenience only.
      }
      rememberPoll({ id, title: poll.title }, false);
      trackEvent('poll_voted', { selected: selected.size });
      toast.success(t('voted'));
    } catch {
      toast.error(t('voteFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      trackEvent('share_link_copied', { source: 'poll' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('duration', { m: poll.durationMinutes })} · {t('shareHint')}
          </p>
          <div>
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
              {copied ? t('copied') : t('copyLink')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="voter-name">{t('yourName')}</Label>
            <Input
              id="voter-name"
              value={name}
              maxLength={50}
              placeholder={t('namePlaceholder')}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <p className="text-sm font-medium pt-2">{t('selectTimes')}</p>
          {poll.options.map(option => {
            const count = option.voters.length;
            const isBest = count > 0 && count === maxVotes;
            const checked = selected.has(option.id);
            return (
              <label
                key={option.id}
                className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                  checked ? 'border-primary bg-primary/5' : 'bg-card'
                } ${isBest ? 'ring-1 ring-green-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={checked}
                    onChange={() => toggle(option.id)}
                  />
                  <div className="flex-1 space-y-1">
                    {poll.timezones.map(zone => (
                      <p key={zone} className="text-sm tabular-nums">
                        <span className="text-muted-foreground">{zoneName(zone)}: </span>
                        <span className="font-medium">{fmt(option.startsAt, zone)}</span>
                      </p>
                    ))}
                    {!poll.timezones.includes(localZone) && (
                      <p className="text-sm tabular-nums text-primary">
                        {t('yourLocalTime')}: <span className="font-medium">{fmt(option.startsAt, localZone)}</span>
                      </p>
                    )}
                    <p className="pt-1 text-xs text-muted-foreground">
                      {count > 0 ? `${t('votes', { count })}: ${option.voters.join(', ')}` : t('noVotes')}
                      {isBest && <span className="ml-2 font-semibold text-green-600">{t('best')}</span>}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}

          <Button onClick={submit} disabled={submitting} className="w-full">
            {t('submitVote')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
