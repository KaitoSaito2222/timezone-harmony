import { useTranslations } from 'next-intl';
import { Star, Play, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TimezonePreset } from '@/types/preset.types';

interface PresetCardProps {
  preset: TimezonePreset;
  getTimezoneName: (identifier: string) => string;
  formatHoursDisplay: (startTime: string | null, endTime: string | null) => string | null;
  onLoad: (preset: TimezonePreset) => void;
  onEdit: (preset: TimezonePreset) => void;
  onDelete: (preset: TimezonePreset) => void;
  onToggleFavorite: (preset: TimezonePreset) => void;
}

export function PresetCard({
  preset,
  getTimezoneName,
  formatHoursDisplay,
  onLoad,
  onEdit,
  onDelete,
  onToggleFavorite,
}: PresetCardProps) {
  const t = useTranslations('presets');

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{preset.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleFavorite(preset)}
          >
            <Star
              className={`h-4 w-4 ${
                preset.isFavorite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>
        {preset.description && (
          <p className="text-sm text-muted-foreground">{preset.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 space-y-4">
        <div className="flex flex-wrap gap-1">
          {preset.items
            .sort((a, b) => a.position - b.position)
            .slice(0, 5)
            .map((tz) => {
              const hours = formatHoursDisplay(tz.startTime, tz.endTime);
              return (
                <Badge key={tz.id} variant="secondary" className="text-xs">
                  {getTimezoneName(tz.timezoneIdentifier)}
                  {hours && <span className="ml-1 opacity-70">({hours})</span>}
                </Badge>
              );
            })}
          {preset.items.length > 5 && (
            <Badge variant="outline" className="text-xs">
              {t('moreCount', { count: preset.items.length - 5 })}
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onLoad(preset)}
          >
            <Play className="h-3 w-3 mr-1" />
            {t('load')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(preset)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(preset)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
