import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useAuthStore } from '@/stores/authStore';
import { TimezoneSelector } from '@/components/timezone/TimezoneSelector';
import { TimezoneComparison } from '@/components/timezone/TimezoneComparison';
import { LocalTimeCard } from '@/components/timezone/LocalTimeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const {
    popularTimezones,
    selectedTimezones,
    loadTimezones,
    addTimezone,
    removeTimezone,
  } = useTimezoneStore();
  const { isAuthenticated } = useAuthStore();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadTimezones();
  }, [loadTimezones]);

  const handleAddTimezone = (identifier: string) => {
    addTimezone(identifier);
    setShowSelector(false);
  };

  return (
    <div className="space-y-6">
      {/* Local Time Card */}
      <LocalTimeCard />

      {/* Timeline Comparison (includes timezone selection) */}
      <TimezoneComparison
        timezones={selectedTimezones}
        onAddTimezone={() => setShowSelector(true)}
        onRemoveTimezone={removeTimezone}
      />

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
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-5 w-5" />
                <p className="font-medium">
                  Login to save your timezone presets and business hours
                </p>
              </div>
              <Link to="/login">
                <Button>
                  Login
                </Button>
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
