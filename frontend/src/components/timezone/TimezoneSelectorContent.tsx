'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TimezoneSelectorContentProps {
  onSelect: (identifier: string) => void;
  excludeTimezones?: string[];
}

export function TimezoneSelectorContent({
  onSelect,
  excludeTimezones = [],
}: TimezoneSelectorContentProps) {
  const { allTimezones, popularTimezones } = useTimezoneStore();
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('timezone');

  const localTimezone = useMemo(() => {
    const identifier = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return allTimezones.find((tz) => tz.identifier === identifier) ?? null;
  }, [allTimezones]);

  const filteredTimezones = useMemo(() => {
    if (searchQuery.length < 2) {
      return allTimezones.filter((tz) => !excludeTimezones.includes(tz.identifier));
    }
    const query = searchQuery.toLowerCase();
    return allTimezones.filter(
      (tz) =>
        !excludeTimezones.includes(tz.identifier) &&
        (tz.identifier.toLowerCase().includes(query) ||
          tz.displayName.toLowerCase().includes(query) ||
          tz.country?.toLowerCase().includes(query))
    );
  }, [searchQuery, allTimezones, excludeTimezones]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {localTimezone && !excludeTimezones.includes(localTimezone.identifier) && (
        <>
          <div className="shrink-0 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('yourTimezone')}</h3>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onSelect(localTimezone.identifier)}
            >
              {localTimezone.displayName}
            </Badge>
          </div>
          <Separator className="shrink-0" />
        </>
      )}
      <div className="shrink-0 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{t('popular')}</h3>
        <div className="flex flex-wrap gap-2">
          {popularTimezones
            .filter((tz) => !excludeTimezones.includes(tz.identifier))
            .map((tz) => (
              <Badge
                key={tz.identifier}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onSelect(tz.identifier)}
              >
                {tz.displayName}
              </Badge>
            ))}
        </div>
      </div>
      <Separator className="shrink-0" />

      <div className="shrink-0 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchTimezones')}
          className="pl-10"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
          {searchQuery.length >= 2 ? t('searchResults') : t('allTimezones')}
        </h3>
        {filteredTimezones.length > 0 ? (
          filteredTimezones.map((tz) => (
            <Button
              key={tz.identifier}
              variant="ghost"
              className="w-full justify-between h-auto py-2"
              onClick={() => onSelect(tz.identifier)}
            >
              <span>{tz.displayName}</span>
              <span className="text-sm text-muted-foreground">{tz.offset}</span>
            </Button>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t('noTimezonesFound')}
          </p>
        )}
      </div>
    </div>
  );
}
