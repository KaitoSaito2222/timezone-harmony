'use client';

import { useLocale, useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { Bookmark, BookmarkX, Link2, ListChecks, Share2, Type } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/cities';
import { getLocaleMeta } from '@/i18n/localeConfig';
import { trackEvent } from '@/lib/analytics';
import { clearSavedCities, saveCities } from '@/lib/saved-cities';
import { formatOffsetHours } from '@/lib/dst';

interface ShareBarProps {
  timezones: string[];
  /** Selected moment as a datetime-local string, interpreted in `baseTimezone`. */
  selectedDateTime: string;
  baseTimezone: string;
  getDisplayName: (identifier: string) => string;
}

export function ShareBar({ timezones, selectedDateTime, baseTimezone, getDisplayName }: ShareBarProps) {
  const t = useTranslations('share');
  const locale = useLocale();
  const { pathPrefix } = getLocaleMeta(locale);

  const buildLink = () => {
    const origin = window.location.origin;
    const matched = timezones.map(id => CITIES.find(c => c.identifier === id));
    const isCityPair =
      timezones.length >= 2 && timezones.length <= 3 && matched.every(c => c && CITIES.filter(x => x.identifier === c.identifier).length === 1);
    if (isCityPair) {
      return `${origin}${pathPrefix}/${matched.map(c => c!.slug).sort().join('-')}`;
    }
    return `${origin}${pathPrefix}/?tz=${timezones.map(encodeURIComponent).join(',')}`;
  };

  const buildText = () => {
    const base =
      baseTimezone === 'local'
        ? DateTime.fromISO(selectedDateTime)
        : DateTime.fromISO(selectedDateTime, { zone: baseTimezone });
    const lines = timezones.map(tz => {
      const dt = base.setZone(tz).setLocale(locale);
      return `${getDisplayName(tz)}: ${dt.toFormat('MMM d, HH:mm')} (UTC${formatOffsetHours(dt.offset)})`;
    });
    return `${t('textHeader')}\n${lines.join('\n')}\n${buildLink()}`;
  };

  const copy = async (text: string, okMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(okMessage);
      return true;
    } catch {
      toast.error(t('copyFailed'));
      return false;
    }
  };

  const onCopyLink = async () => {
    if (await copy(buildLink(), t('linkCopied'))) trackEvent('share_link_copied', { source: 'comparison' });
  };

  const onCopyText = async () => {
    if (await copy(buildText(), t('textCopied'))) trackEvent('share_text_copied');
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title: 'Timezone Harmony', text: buildText() });
      trackEvent('share_link_copied', { source: 'native' });
    } catch {
      // User dismissed the share sheet.
    }
  };

  const onSave = () => {
    if (saveCities(timezones)) {
      trackEvent('my_cities_saved', { cities: timezones.length });
      toast.success(t('citiesSaved'));
    } else {
      toast.error(t('copyFailed'));
    }
  };

  const onClearSaved = () => {
    clearSavedCities();
    toast.success(t('savedCleared'));
  };

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const pollHref = `/poll/new?tz=${timezones.map(encodeURIComponent).join(',')}`;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('groupLabel')}>
      <Button size="sm" variant="outline" onClick={onCopyLink} disabled={timezones.length === 0}>
        <Link2 className="h-4 w-4 mr-1.5" />
        {t('copyLink')}
      </Button>
      <Button size="sm" variant="outline" onClick={onCopyText} disabled={timezones.length === 0}>
        <Type className="h-4 w-4 mr-1.5" />
        {t('copyText')}
      </Button>
      {canNativeShare && (
        <Button size="sm" variant="outline" onClick={onNativeShare} disabled={timezones.length === 0}>
          <Share2 className="h-4 w-4 mr-1.5" />
          {t('share')}
        </Button>
      )}
      <Button size="sm" variant="outline" asChild disabled={timezones.length === 0}>
        <Link href={pollHref}>
          <ListChecks className="h-4 w-4 mr-1.5" />
          {t('createPoll')}
        </Link>
      </Button>
      <Button size="sm" variant="outline" onClick={onSave} disabled={timezones.length === 0}>
        <Bookmark className="h-4 w-4 mr-1.5" />
        {t('saveCities')}
      </Button>
      <Button size="sm" variant="ghost" onClick={onClearSaved} aria-label={t('clearSaved')}>
        <BookmarkX className="h-4 w-4" />
      </Button>
    </div>
  );
}
