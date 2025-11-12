import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Import types, constants, utils and sub-components
import type { TaskRepeatConfig, TaskRepeatModalProps } from './types';
import { MONTH_NAMES } from './constants';
import { calculateOccurrences, getRepeatSummary } from './utils';
import { RepeatTypeSelector } from './repeat-type-selector';
import { WeekDaySelector } from './week-day-selector';
import { OccurrencePreview } from './occurrence-preview';

// ============================================================================
// MAIN COMPONENT: TaskRepeatModal
// ============================================================================

export const TaskRepeatModal: React.FC<TaskRepeatModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig = {},
}) => {
  // State
  const [config, setConfig] = useState<Partial<TaskRepeatConfig>>({
    repeatType: initialConfig.repeatType || 'none',
    interval: initialConfig.interval || 1,
    startDate: initialConfig.startDate || new Date().toISOString().split('T')[0],
    endType: initialConfig.endType || 'never',
    endDate: initialConfig.endDate || '',
    occurrences: initialConfig.occurrences || 10,
    weekDays: initialConfig.weekDays || [1],
    monthDay: initialConfig.monthDay || 1,
    monthType: initialConfig.monthType || 'day',
    yearMonth: initialConfig.yearMonth || 0,
    startTime: initialConfig.startTime || '09:00',
    endTime: initialConfig.endTime || '10:00',
    workDaysOnly: initialConfig.workDaysOnly || false,
    excludeHolidays: initialConfig.excludeHolidays || false,
  });

  // UI State
  const [showAllOccurrences, setShowAllOccurrences] = useState(false);
  const [nextOccurrences, setNextOccurrences] = useState<Date[]>([]);

  // Update occurrences when config changes
  useEffect(() => {
    setNextOccurrences(calculateOccurrences(config));
  }, [config]);

  // Update a config value
  const updateConfig = <K extends keyof TaskRepeatConfig>(
    key: K,
    value: TaskRepeatConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Handle save
  const handleSave = () => {
    if (config.repeatType === 'none') return;

    const finalConfig: TaskRepeatConfig = {
      repeatType: config.repeatType!,
      interval: config.interval!,
      startDate: config.startDate!,
      endType: config.endType!,
      endDate: config.endType === 'date' ? config.endDate : undefined,
      occurrences: config.endType === 'occurrences' ? config.occurrences : undefined,
      weekDays: config.repeatType === 'weekly' ? config.weekDays : undefined,
      monthDay: config.repeatType === 'monthly' ? config.monthDay : undefined,
      monthType: config.repeatType === 'monthly' ? config.monthType : undefined,
      yearMonth: config.repeatType === 'yearly' ? config.yearMonth : undefined,
      startTime: config.startTime!,
      endTime: config.endTime!,
      workDaysOnly: config.workDaysOnly!,
      excludeHolidays: config.excludeHolidays!,
    };

    onSave(finalConfig);
    onClose();
  };

  const summary = getRepeatSummary(config);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Configurazione Ripetizione
          </DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Repeat Type */}
          <RepeatTypeSelector
            value={config.repeatType!}
            onChange={(v) => updateConfig('repeatType', v)}
          />

          {config.repeatType !== 'none' && (
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
                      value={config.interval}
                      onChange={(e) =>
                        updateConfig('interval', parseInt(e.target.value) || 1)
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      {config.repeatType === 'daily' &&
                        (config.interval === 1 ? 'giorno' : 'giorni')}
                      {config.repeatType === 'weekly' &&
                        (config.interval === 1 ? 'settimana' : 'settimane')}
                      {config.repeatType === 'monthly' &&
                        (config.interval === 1 ? 'mese' : 'mesi')}
                      {config.repeatType === 'yearly' &&
                        (config.interval === 1 ? 'anno' : 'anni')}
                    </span>
                  </div>
                </div>

                {/* Weekly: Day Selection */}
                {config.repeatType === 'weekly' && (
                  <WeekDaySelector
                    selectedDays={config.weekDays!}
                    onChange={(days) => updateConfig('weekDays', days)}
                  />
                )}

                {/* Monthly: Day */}
                {config.repeatType === 'monthly' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="monthDay" className="text-right">
                      Giorno
                    </Label>
                    <Input
                      id="monthDay"
                      type="number"
                      min="1"
                      max="31"
                      value={config.monthDay}
                      onChange={(e) =>
                        updateConfig('monthDay', parseInt(e.target.value) || 1)
                      }
                      className="col-span-3 w-20"
                    />
                  </div>
                )}

                {/* Yearly: Month + Day */}
                {config.repeatType === 'yearly' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="yearMonth" className="text-right">
                        Mese
                      </Label>
                      <Select
                        value={String(config.yearMonth)}
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
                        value={config.monthDay}
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
                    value={config.startDate}
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
                      value={config.startTime}
                      onChange={(e) => updateConfig('startTime', e.target.value)}
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                      type="time"
                      value={config.endTime}
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
                      checked={config.endType === 'never'}
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
                      checked={config.endType === 'date'}
                      onChange={() => updateConfig('endType', 'date')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="endDate" className="font-normal cursor-pointer">
                      Il giorno
                    </Label>
                    {config.endType === 'date' && (
                      <Input
                        type="date"
                        value={config.endDate}
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
                      checked={config.endType === 'occurrences'}
                      onChange={() => updateConfig('endType', 'occurrences')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="endOccurrences" className="font-normal cursor-pointer">
                      Dopo
                    </Label>
                    {config.endType === 'occurrences' && (
                      <>
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={config.occurrences}
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
                      checked={config.workDaysOnly}
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
                      checked={config.excludeHolidays}
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
                startTime={config.startTime!}
                endTime={config.endTime!}
                showAll={showAllOccurrences}
                onToggleShowAll={() => setShowAllOccurrences(!showAllOccurrences)}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            disabled={config.repeatType === 'none'}
          >
            Salva configurazione
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskRepeatModal;
