import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OptimalTime } from '@/lib/timeline';

interface OptimalMeetingTimesProps {
  optimalTimes: OptimalTime[];
}

export function OptimalMeetingTimes({ optimalTimes }: OptimalMeetingTimesProps) {
  if (optimalTimes.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-600" />
            Recommended Meeting Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Found {optimalTimes.length} time slots where all participants are within business hours!
          </p>
          <div className="flex flex-wrap gap-3">
            {optimalTimes.slice(0, 5).map((opt, index) => (
              <Badge key={index} variant="outline" className="px-3 py-2 text-sm">
                {opt.times.map((t) => `${t.timezone}: ${t.time}`).join(' | ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          No Perfect Match Found
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          No time slots found where all participants are within business hours.
          Some participants may need to meet outside their normal hours.
        </p>
      </CardContent>
    </Card>
  );
}
