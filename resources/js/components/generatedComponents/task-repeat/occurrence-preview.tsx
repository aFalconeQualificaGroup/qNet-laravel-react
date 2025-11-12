import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ============================================================================
// OCCURRENCE PREVIEW
// ============================================================================

interface OccurrencePreviewProps {
  occurrences: Date[];
  startTime: string;
  endTime: string;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export const OccurrencePreview: React.FC<OccurrencePreviewProps> = ({
  occurrences,
  startTime,
  endTime,
  showAll,
  onToggleShowAll,
}) => {
  const displayCount = showAll ? occurrences.length : Math.min(10, occurrences.length);

  if (occurrences.length === 0) return null;

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            Prossime occorrenze
          </Label>
          <Badge variant="secondary">
            {occurrences.length} {occurrences.length === 1 ? 'occorrenza' : 'occorrenze'}
          </Badge>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-2">
          {occurrences.slice(0, displayCount).map((date, i) => {
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

        {occurrences.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleShowAll}
            className="w-full"
          >
            {showAll
              ? 'Mostra meno'
              : `Mostra tutte (${occurrences.length})`}
          </Button>
        )}
      </div>
    </Card>
  );
};
