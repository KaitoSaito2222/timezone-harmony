import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTimezoneStore } from '@/stores/timezoneStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TimezoneSelectorProps {
  onSelect: (identifier: string) => void;
  onClose: () => void;
  excludeTimezones?: string[];
}

export function TimezoneSelector({
  onSelect,
  onClose,
  excludeTimezones = [],
}: TimezoneSelectorProps) {
  const { allTimezones, popularTimezones } = useTimezoneStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimezones = useMemo(() => {
    if (searchQuery.length < 2) {
      return allTimezones.filter((tz) => !excludeTimezones.includes(tz.identifier));
    }
    const query = searchQuery.toLowerCase();
    return allTimezones.filter(
      (tz) =>
        !excludeTimezones.includes(tz.identifier) &&
        (tz.identifier.toLowerCase().includes(query) ||
          tz.displayName.toLowerCase().includes(query))
    );
  }, [searchQuery, allTimezones, excludeTimezones]);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Timezone</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timezones..."
            className="pl-10"
            autoFocus
          />
        </div>

        {searchQuery.length < 2 && (
          <>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Popular</h3>
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
            <Separator />
          </>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 min-h-[200px]">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
            {searchQuery.length >= 2 ? 'Search Results' : 'All Timezones'}
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
              No timezones found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
