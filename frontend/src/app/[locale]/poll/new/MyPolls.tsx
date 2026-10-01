'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { forgetPoll, loadSavedPolls, type SavedPoll } from '@/lib/saved-polls';
import { pollService } from '@/services/poll.service';

export function MyPolls() {
  const t = useTranslations('poll');
  const { isAuthenticated } = useAuthStore();
  const [polls, setPolls] = useState<SavedPoll[]>([]);

  useEffect(() => {
    const local = loadSavedPolls();
    setPolls(local);
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      try {
        // Move polls created anonymously on this device under the account, then
        // merge the account's polls (available on any device) with the local list.
        const createdLocally = local.filter(p => p.created).map(p => p.id);
        if (createdLocally.length > 0) await pollService.claim(createdLocally);
        const owned = await pollService.listMine();
        if (cancelled) return;
        const byId = new Map<string, SavedPoll>(local.map(p => [p.id, p]));
        for (const o of owned) {
          byId.set(o.id, { id: o.id, title: o.title, created: true, savedAt: o.createdAt });
        }
        setPolls([...byId.values()].sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
      } catch {
        // Keep showing the device-local list if the account lookup fails.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (polls.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('myPolls')}</CardTitle>
        <p className="text-xs text-muted-foreground">{t('myPollsHint')}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {polls.map(poll => (
          <div key={poll.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <Link href={`/poll/${poll.id}`} className="flex-1 truncate text-sm font-medium hover:underline">
              {poll.title}
            </Link>
            <Badge variant="outline">{poll.created ? t('badgeCreated') : t('badgeVoted')}</Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('removeFromList')}
              onClick={() => {
                forgetPoll(poll.id);
                setPolls(prev => prev.filter(p => p.id !== poll.id));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
