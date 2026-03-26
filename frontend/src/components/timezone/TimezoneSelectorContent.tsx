'use client';
import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
  const locale = useLocale();

  const localTimezone = useMemo(() => {
    const identifier = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return allTimezones.find((tz) => tz.identifier === identifier) ?? null;
  }, [allTimezones]);

  const filteredTimezones = useMemo(() => {
    if (searchQuery.length < 1) {
      return allTimezones.filter((tz) => !excludeTimezones.includes(tz.identifier));
    }
    // Converts hiragana characters to katakana so that searching "とうきょう" also matches "トウキョウ".
    // Unicode: hiragana U+3041–U+3096, katakana starts 0x60 higher (e.g. あ U+3041 → ア U+30A1).
    const toKatakana = (str: string) =>
      str.replace(/[\u3041-\u3096]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
    // Normalize the search query: lowercase + hiragana→katakana conversion.
    const query = toKatakana(searchQuery.toLowerCase());
    // Returns true if any locale value in a localized field (e.g. localizedCities, localizedCountry)
    // contains the search query after the same normalization.
    const matchesLocalizedField = (field?: Record<string, string>) =>
      field ? Object.values(field).some((v) => toKatakana(v.toLowerCase()).includes(query)) : false;
    return allTimezones.filter(
      (tz) =>
        // Skip timezones that are already selected elsewhere in the UI.
        !excludeTimezones.includes(tz.identifier) &&
        // Match against every searchable field. At least one must contain the query.
        (tz.identifier.toLowerCase().includes(query) || // e.g. "America/New_York"
          tz.displayName.toLowerCase().includes(query) || // e.g. "New York"
          tz.country?.toLowerCase().includes(query) || // e.g. "United States"
          matchesLocalizedField(tz.localizedCities) || // e.g. "ニューヨーク"
          matchesLocalizedField(tz.localizedCitiesReading) || // e.g. "ニューヨーク" (katakana reading for kana search)
          matchesLocalizedField(tz.localizedCountry) || // e.g. "アメリカ合衆国"
          matchesLocalizedField(tz.localizedCountryReading)) // e.g. "アメリカガッシュウコク" (katakana reading)
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
              {localTimezone.localizedCities?.[locale] ?? localTimezone.displayName}
              <span className="ml-1 opacity-60">{localTimezone.offset}</span>
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
                {tz.localizedCities?.[locale] ?? tz.displayName}
                <span className="ml-1 opacity-60">{tz.offset}</span>
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
          {searchQuery.length >= 1 ? t('searchResults') : t('allTimezones')}
        </h3>
        {filteredTimezones.length > 0 ? (
          filteredTimezones.map((tz) => (
            <Button
              key={tz.identifier}
              variant="ghost"
              className="w-full justify-between h-auto py-2"
              onClick={() => onSelect(tz.identifier)}
            >
              <span className="flex flex-col items-start">
                <span>{tz.localizedCities?.[locale] ?? tz.displayName}</span>
                {(tz.localizedCountry?.[locale] ?? tz.country) && (
                  <span className="text-xs text-muted-foreground">
                    {tz.localizedCountry?.[locale] ?? tz.country}
                  </span>
                )}
              </span>
              <span className="text-sm text-muted-foreground shrink-0">{tz.offset}</span>
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
