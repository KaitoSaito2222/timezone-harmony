'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Lock } from 'lucide-react';
import { useTimezoneStore, MAX_TIMEZONES } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { TimezoneSelector } from '@/components/timezone/TimezoneSelector';
import { TimezoneComparison } from '@/components/timezone/TimezoneComparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CityPairAppProps {
  defaultIdentifiers: string[];
}

export function CityPairApp({ defaultIdentifiers }: CityPairAppProps) {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const {
    selectedTimezones,
    loadTimezones,
    addTimezone,
    removeTimezone,
    setSelectedTimezones,
  } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    setSelectedTimezones(defaultIdentifiers);
    loadTimezones();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTimezone = (identifier: string) => {
    addTimezone(identifier);
    setShowSelector(false);
  };

  return (
    <div className="space-y-4">
      <TimezoneComparison
        timezones={selectedTimezones}
        onAddTimezone={() => selectedTimezones.length < MAX_TIMEZONES && setShowSelector(true)}
        onRemoveTimezone={removeTimezone}
      />

      {!isAuthenticated && (
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="py-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-4 w-4" />
                <p className="text-sm font-medium">{t('loginPrompt')}</p>
              </div>
              <Link href="/login">
                <Button size="sm">{tc('login')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

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
