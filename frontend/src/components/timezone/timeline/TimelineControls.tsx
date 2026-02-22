'use client';
import { Clock, Columns3, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineControlsProps {
  showBusinessHours: boolean;
  onToggleBusinessHours: () => void;
  layoutMode: 'vertical' | 'horizontal';
  onToggleLayout: () => void;
}

export function TimelineControls({
  showBusinessHours,
  onToggleBusinessHours,
  layoutMode,
  onToggleLayout,
}: TimelineControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
      {showBusinessHours ? (
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-500 shrink-0" />
            <span>Work</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-500 shrink-0" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-500 shrink-0" />
            <span>Off</span>
          </div>
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-2">
        <Button
          variant={showBusinessHours ? 'default' : 'outline'}
          size="sm"
          className="h-8 text-xs"
          onClick={onToggleBusinessHours}
        >
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Work Hours
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onToggleLayout}
        >
          {layoutMode === 'vertical' ? (
            <>
              <Rows3 className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Horizontal</span>
            </>
          ) : (
            <>
              <Columns3 className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Vertical</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
