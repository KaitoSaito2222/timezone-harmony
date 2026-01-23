import { useEffect, useState } from 'react';
import { Plus, X, Globe, Clock, Lock } from 'lucide-react';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { TimezoneSelector } from '@/components/timezone/TimezoneSelector';
import { TimezoneComparison } from '@/components/timezone/TimezoneComparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HomePage() {
  const {
    popularTimezones,
    selectedTimezones,
    loadTimezones,
    addTimezone,
    removeTimezone,
    refreshCurrentTimes,
  } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadTimezones();
  }, [loadTimezones]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTimezones.length > 0) {
        refreshCurrentTimes();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezones, refreshCurrentTimes]);

  const handleAddTimezone = (identifier: string) => {
    addTimezone(identifier);
    setShowSelector(false);
  };

  return (
    <div className="space-y-8">
      {/* Timezone Selector Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Select Timezones to Compare
          </CardTitle>
          <Button onClick={() => setShowSelector(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Timezone
          </Button>
        </CardHeader>
        <CardContent>
          {selectedTimezones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTimezones.map((tz) => (
                <Badge
                  key={tz}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  <span>{tz.split('/')[1]?.replace(/_/g, ' ') || tz}</span>
                  <button
                    onClick={() => removeTimezone(tz)}
                    className="hover:bg-muted rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No timezones selected. Click "Add Timezone" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Timezone Comparison */}
      {selectedTimezones.length > 0 ? (
        <TimezoneComparison timezones={selectedTimezones} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No Timezones Selected</h3>
            <p className="text-muted-foreground mb-6">
              Click "Add Timezone" to start comparing times across different regions
            </p>
            <Button onClick={() => setShowSelector(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Timezone
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Access - Popular Timezones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Quick Access - Popular Timezones
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
                disabled={selectedTimezones.includes(tz.identifier)}
              >
                {tz.displayName} ({tz.offset})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sign in prompt */}
      {!isAuthenticated && (
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="py-6 text-center">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Lock className="h-5 w-5" />
              <p className="font-medium">
                Sign in to save your timezone presets and business hours
              </p>
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
