import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { calculateOccurrences, getRepeatSummary } from './utils';
import { TaskRepeatConfig } from './types';

// ============================================================================
// OCCURRENCE PREVIEW
// ============================================================================

interface OccurrencePreviewProps {
  config: Partial<TaskRepeatConfig>;
  startTime: string;
  endTime: string;

}

export const OccurrencePreview: React.FC<OccurrencePreviewProps> = React.memo(({
  config,
  startTime,
  endTime,
}) => {

  console.log('🔄 OccurrencePreview RENDER', { config, startTime, endTime });

  const [showAll, setShowAll] = useState(false);

  const onToggleShowAll = () => {
    console.log('🔘 Toggle showAll:', !showAll);
    setShowAll((prev) => !prev);
  };

   // Memoized calculations
  const nextOccurrences = useMemo(() => calculateOccurrences(config), [config]);
  const summary = useMemo(() => getRepeatSummary(config), [config]);

  const displayCount = showAll ? nextOccurrences.length : Math.min(10, nextOccurrences.length);

  if (nextOccurrences.length === 0) return null;

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            Prossime occorrenze
          </Label>
          <Badge variant="secondary">
            {nextOccurrences.length} {nextOccurrences.length === 1 ? 'occorrenza' : 'occorrenze'}
          </Badge>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-2">
          {nextOccurrences.slice(0, displayCount).map((date, i) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 py-2 px-3 rounded-md text-sm',
                  isToday && 'bg-green-100 dark:bg-green-900/20 font-medium',
                  !isToday && isWeekend && 'bg-muted',
                  !isToday && !isWeekend && 'bg-background'
                )}
              >
                <span className="font-mono text-xs text-muted-foreground w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  {date.toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    year: i === 0 ? 'numeric' : undefined,
                  })}
                  {isToday && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Oggi
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {startTime} - {endTime}
                </span>
              </div>
            );
          })}
        </div>

        {nextOccurrences.length > 10 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleShowAll}
            className="w-full"
          >
            {showAll
              ? 'Mostra meno'
              : `Mostra tutte (${nextOccurrences.length})`}
          </Button>
        )}
      </div>
    </Card>
  );
});

OccurrencePreview.displayName = 'OccurrencePreview';
