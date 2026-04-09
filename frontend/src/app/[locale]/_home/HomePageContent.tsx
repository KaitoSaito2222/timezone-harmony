'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Clock, Lock } from 'lucide-react';
import { useTimezoneStore, MAX_TIMEZONES } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { TimezoneSelector } from '@/components/timezone/TimezoneSelector';
import { TimezoneComparison } from '@/components/timezone/TimezoneComparison';
import { LocalTimeCard } from '@/components/timezone/LocalTimeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CITIES, POPULAR_PAIRS, parseCities, getCityLocalized } from '@/lib/cities';

export function HomePageContent() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const locale = useLocale();
  const {
    popularTimezones,
    selectedTimezones,
    loadTimezones,
    addTimezone,
    removeTimezone,
    clearTimezones,
    setSelectedTimezones,
  } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadTimezones();

    // Pre-load timezones from ?tz= query param (e.g. from city pair pages)
    const params = new URLSearchParams(window.location.search);
    const tzParam = params.get('tz');
    if (tzParam) {
      const identifiers = tzParam.split(',').map(decodeURIComponent).filter(Boolean);
      if (identifiers.length > 0) {
        setSelectedTimezones(identifiers);
      }
    }
  }, [loadTimezones, setSelectedTimezones]);

  const handleAddTimezone = (identifier: string) => {
    addTimezone(identifier);
    setShowSelector(false);
  };

  // Derive city-pair slug from selected timezones (2-3 cities, all must be in CITIES)
  const cityPairSlug = (() => {
    if (selectedTimezones.length < 2 || selectedTimezones.length > 3) return null;
    const matched = selectedTimezones.map(id => CITIES.find(c => c.identifier === id));
    if (matched.some(c => !c)) return null;
    return matched.map(c => c!.slug).sort().join('-');
  })();

  return (
    <div className="space-y-6">
      <LocalTimeCard />

      <TimezoneComparison
        timezones={selectedTimezones}
        onAddTimezone={() => selectedTimezones.length < MAX_TIMEZONES && setShowSelector(true)}
        onRemoveTimezone={removeTimezone}
        onClearTimezones={clearTimezones}
      />

      {cityPairSlug && (() => {
        const cities = parseCities(cityPairSlug);
        if (!cities) return null;
        const cityNames = cities.map(c => getCityLocalized(c, locale).name).join(' ↔ ');
        return (
          <div className="text-center">
            <Link
              href={`/${cityPairSlug}`}
              className="text-sm text-primary hover:underline"
            >
              {t('viewDetailedComparison', { cities: cityNames })}
            </Link>
          </div>
        );
      })()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('quickAccess')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTimezones.map((tz) => (
              <Button
                key={tz.identifier}
                variant="outline"
                size="sm"
                onClick={() => addTimezone(tz.identifier)}
                disabled={selectedTimezones.includes(tz.identifier) || selectedTimezones.length >= MAX_TIMEZONES}
              >
                {tz.localizedCities?.[locale] ?? tz.displayName} ({tz.offset})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="py-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-5 w-5" />
                <p className="font-medium">{t('loginPrompt')}</p>
              </div>
              <Link href="/login">
                <Button>{tc('login')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⭐ {tc('popularComparisons')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PAIRS.map(({ slug }) => {
              const cities = parseCities(slug);
              const label = cities
                ? cities.map(c => getCityLocalized(c, locale).name).join(' ↔ ')
                : slug;
              return (
                <Button key={slug} variant="outline" size="sm" asChild>
                  <Link href={`/${slug}`}>{label}</Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showSelector && (
        <TimezoneSelector
          onSelect={handleAddTimezone}
          onClose={() => setShowSelector(false)}
          excludeTimezones={selectedTimezones}
        />
      )}
    </div>
  );
}
