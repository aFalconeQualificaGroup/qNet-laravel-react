import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { WEEK_DAY_NAMES } from './constants';

// ============================================================================
// WEEK DAY SELECTOR
// ============================================================================

interface WeekDaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDays,
  onChange,
}) => {
  const toggleDay = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort();
    onChange(newDays);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">Giorni della settimana</Label>
      <div className="grid grid-cols-7 gap-2">
        {WEEK_DAY_NAMES.map((day, index) => (
          <Button
            key={index}
            type="button"
            variant={selectedDays.includes(index) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDay(index)}
            className="h-9"
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  );
};
