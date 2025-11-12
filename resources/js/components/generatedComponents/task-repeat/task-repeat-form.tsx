import React, { useMemo, useCallback } from 'react';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Import types, constants, utils and sub-components
import type { TaskRepeatConfig } from './types';
import { MONTH_NAMES } from './constants';
import { calculateOccurrences, getRepeatSummary } from './utils';
import { RepeatTypeSelector } from './repeat-type-selector';
import { WeekDaySelector } from './week-day-selector';
import { OccurrencePreview } from './occurrence-preview';

// ============================================================================
// PROPS
// ============================================================================

export interface TaskRepeatFormProps {
  value: Partial<TaskRepeatConfig>;
  onChange: (
    config:
      | Partial<TaskRepeatConfig>
      | ((prev: Partial<TaskRepeatConfig>) => Partial<TaskRepeatConfig>)
  ) => void;
  className?: string;
  showAllOccurrences?: boolean;
  onToggleShowAllOccurrences?: () => void;
}

// ============================================================================
// MAIN COMPONENT: TaskRepeatForm (Fully Controlled)
// ============================================================================

export const TaskRepeatForm: React.FC<TaskRepeatFormProps> = ({
  value,
  onChange,
  className,
  showAllOccurrences = false,
  onToggleShowAllOccurrences = () => {},
}) => {
  // Memoized calculations
  const nextOccurrences = useMemo(() => calculateOccurrences(value), [value]);
  const summary = useMemo(() => getRepeatSummary(value), [value]);

  // Update a config value - memoized to avoid re-creating function on each render
  const updateConfig = useCallback(
    (key: keyof TaskRepeatConfig, newValue: any) => {
      onChange((prev: Partial<TaskRepeatConfig>) => ({ ...prev, [key]: newValue }));
    },
    [onChange]
  );
 
  return (
    <div className={className}>
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          Configurazione Ripetizione
        </h3>
        <p className="text-sm text-muted-foreground">{summary}</p>
      </div>

      <div className="space-y-6">
        {/* Repeat Type */}
        <RepeatTypeSelector
          value={value.repeatType || 'none'}
          onChange={(v) => updateConfig('repeatType', v)}
        />

        {value.repeatType !== 'none' && (
          <>
            <Separator />

            {/* Basic Settings */}
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Impostazioni Base
              </Label>

              {/* Interval */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interval" className="text-right">
                  Intervallo
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="365"
                    value={value.interval || 1}
                    onChange={(e) =>
                      updateConfig('interval', parseInt(e.target.value) || 1)
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    {value.repeatType === 'daily' &&
                      ((value.interval || 1) === 1 ? 'giorno' : 'giorni')}
                    {value.repeatType === 'weekly' &&
                      ((value.interval || 1) === 1 ? 'settimana' : 'settimane')}
                    {value.repeatType === 'monthly' &&
                      ((value.interval || 1) === 1 ? 'mese' : 'mesi')}
                    {value.repeatType === 'yearly' &&
                      ((value.interval || 1) === 1 ? 'anno' : 'anni')}
                  </span>
                </div>
              </div>

              {/* Weekly: Day Selection */}
              {value.repeatType === 'weekly' && (
                <WeekDaySelector
                  selectedDays={value.weekDays || [1]}
                  onChange={(days) => updateConfig('weekDays', days)}
                />
              )}

              {/* Monthly: Day */}
              {value.repeatType === 'monthly' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="monthDay" className="text-right">
                    Giorno
                  </Label>
                  <Input
                    id="monthDay"
                    type="number"
                    min="1"
                    max="31"
                    value={value.monthDay || 1}
                    onChange={(e) =>
                      updateConfig('monthDay', parseInt(e.target.value) || 1)
                    }
                    className="col-span-3 w-20"
                  />
                </div>
              )}

              {/* Yearly: Month + Day */}
              {value.repeatType === 'yearly' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="yearMonth" className="text-right">
                      Mese
                    </Label>
                    <Select
                      value={String(value.yearMonth || 0)}
                      onValueChange={(v) => updateConfig('yearMonth', parseInt(v))}
                    >
                      <SelectTrigger id="yearMonth" className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTH_NAMES.map((month, index) => (
                          <SelectItem key={index} value={String(index)}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="yearMonthDay" className="text-right">
                      Giorno
                    </Label>
                    <Input
                      id="yearMonthDay"
                      type="number"
                      min="1"
                      max="31"
                      value={value.monthDay || 1}
                      onChange={(e) =>
                        updateConfig('monthDay', parseInt(e.target.value) || 1)
                      }
                      className="col-span-3 w-20"
                    />
                  </div>
                </>
              )}

              {/* Start Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data Inizio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={value.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateConfig('startDate', e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Orario
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    type="time"
                    value={value.startTime || '09:00'}
                    onChange={(e) => updateConfig('startTime', e.target.value)}
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    type="time"
                    value={value.endTime || '10:00'}
                    onChange={(e) => updateConfig('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* End Settings */}
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Termine
              </Label>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="endNever"
                    name="endType"
                    checked={value.endType === 'never' || !value.endType}
                    onChange={() => updateConfig('endType', 'never')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="endNever" className="font-normal cursor-pointer">
                    Mai
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="endDate"
                    name="endType"
                    checked={value.endType === 'date'}
                    onChange={() => updateConfig('endType', 'date')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="endDate" className="font-normal cursor-pointer">
                    Il giorno
                  </Label>
                  {value.endType === 'date' && (
                    <Input
                      type="date"
                      value={value.endDate || ''}
                      onChange={(e) => updateConfig('endDate', e.target.value)}
                      className="ml-2"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="endOccurrences"
                    name="endType"
                    checked={value.endType === 'occurrences'}
                    onChange={() => updateConfig('endType', 'occurrences')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="endOccurrences" className="font-normal cursor-pointer">
                    Dopo
                  </Label>
                  {value.endType === 'occurrences' && (
                    <>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={value.occurrences || 10}
                        onChange={(e) =>
                          updateConfig('occurrences', parseInt(e.target.value) || 1)
                        }
                        className="w-20 ml-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        occorrenze
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Options */}
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Opzioni
              </Label>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workDaysOnly"
                    checked={value.workDaysOnly || false}
                    onCheckedChange={(checked) =>
                      updateConfig('workDaysOnly', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="workDaysOnly"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Solo giorni lavorativi (escludi weekend)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeHolidays"
                    checked={value.excludeHolidays || false}
                    onCheckedChange={(checked) =>
                      updateConfig('excludeHolidays', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="excludeHolidays"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Escludi festività
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Preview */}
            <OccurrencePreview
              occurrences={nextOccurrences}
              startTime={value.startTime || '09:00'}
              endTime={value.endTime || '10:00'}
              showAll={showAllOccurrences}
              onToggleShowAll={onToggleShowAllOccurrences}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskRepeatForm;
