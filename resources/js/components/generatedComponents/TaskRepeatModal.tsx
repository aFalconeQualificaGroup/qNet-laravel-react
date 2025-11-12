import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Repeat } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TaskRepeatConfig {
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: string;
  endType: 'never' | 'date' | 'occurrences';
  endDate?: string;
  occurrences?: number;
  weekDays?: number[];
  monthDay?: number;
  monthType?: 'day' | 'weekday';
  yearMonth?: number;
  startTime: string;
  endTime: string;
  workDaysOnly: boolean;
  excludeHolidays: boolean;
}

export interface TaskRepeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: TaskRepeatConfig) => void;
  initialConfig?: Partial<TaskRepeatConfig>;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility function to merge CSS classes
 */
const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// ============================================================================
// MAIN COMPONENT: TaskRepeatModal
// ============================================================================

export const TaskRepeatModal: React.FC<TaskRepeatModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig = {},
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [repeatType, setRepeatType] = useState<TaskRepeatConfig['repeatType']>(
    initialConfig.repeatType || 'none'
  );
  const [interval, setInterval] = useState<number>(initialConfig.interval || 1);
  const [startDate, setStartDate] = useState<string>(
    initialConfig.startDate || new Date().toISOString().split('T')[0]
  );
  const [endType, setEndType] = useState<TaskRepeatConfig['endType']>(
    initialConfig.endType || 'never'
  );
  const [endDate, setEndDate] = useState<string>(initialConfig.endDate || '');
  const [occurrences, setOccurrences] = useState<number>(initialConfig.occurrences || 10);
  const [weekDays, setWeekDays] = useState<number[]>(initialConfig.weekDays || [1]);
  const [monthDay, setMonthDay] = useState<number>(initialConfig.monthDay || 1);
  const [monthType, setMonthType] = useState<'day' | 'weekday'>(
    initialConfig.monthType || 'day'
  );
  const [yearMonth, setYearMonth] = useState<number>(initialConfig.yearMonth || 0);
  const [startTime, setStartTime] = useState<string>(initialConfig.startTime || '09:00');
  const [endTime, setEndTime] = useState<string>(initialConfig.endTime || '10:00');
  const [workDaysOnly, setWorkDaysOnly] = useState<boolean>(
    initialConfig.workDaysOnly || false
  );
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(
    initialConfig.excludeHolidays || false
  );
  const [showAllOccurrences, setShowAllOccurrences] = useState<boolean>(false);
  const [nextOccurrences, setNextOccurrences] = useState<Date[]>([]);

  // ============================================================================
  // CONSTANTS
  // ============================================================================
  
  const weekDayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Calculate next occurrences based on configuration
   */
  useEffect(() => {
    if (repeatType === 'none' || !startDate) {
      setNextOccurrences([]);
      return;
    }

    const occurrencesList: Date[] = [];
    const start = new Date(startDate);
    const end = endType === 'date' && endDate ? new Date(endDate) : null;
    const maxOccurrences = endType === 'occurrences' ? occurrences : 100;
    
    let currentDate = new Date(start);
    let count = 0;

    while (count < maxOccurrences) {
      if (end && currentDate > end) break;

      let shouldAdd = true;

      // Check work days only
      if (workDaysOnly) {
        const day = currentDate.getDay();
        if (day === 0 || day === 6) shouldAdd = false;
      }

      if (shouldAdd) {
        occurrencesList.push(new Date(currentDate));
        count++;
      }

      // Increment based on repeat type
      switch (repeatType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7 * interval);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }

      // Safety limit
      if (count >= 365) break;
    }

    setNextOccurrences(occurrencesList);
  }, [
    repeatType,
    interval,
    startDate,
    endType,
    endDate,
    occurrences,
    weekDays,
    workDaysOnly,
    monthDay,
    monthType,
    yearMonth,
  ]);

  /**
   * Keyboard shortcuts handler
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, repeatType]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Toggle week day selection
   */
  const toggleWeekDay = (day: number): void => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  /**
   * Handle save configuration
   */
  const handleSave = (): void => {
    if (repeatType === 'none') return;

    const config: TaskRepeatConfig = {
      repeatType,
      interval,
      startDate,
      endType,
      endDate: endType === 'date' ? endDate : undefined,
      occurrences: endType === 'occurrences' ? occurrences : undefined,
      weekDays: repeatType === 'weekly' ? weekDays : undefined,
      monthDay: repeatType === 'monthly' ? monthDay : undefined,
      monthType: repeatType === 'monthly' ? monthType : undefined,
      yearMonth: repeatType === 'yearly' ? yearMonth : undefined,
      startTime,
      endTime,
      workDaysOnly,
      excludeHolidays,
    };

    onSave(config);
    onClose();
  };

  /**
   * Get human-readable summary of repeat configuration
   */
  const getRepeatSummary = (): string => {
    if (repeatType === 'none') return 'Nessuna ripetizione';

    const intervalText = interval === 1 ? '' : `ogni ${interval} `;
    let summary = '';

    switch (repeatType) {
      case 'daily':
        summary = `${intervalText}${interval === 1 ? 'Ogni giorno' : 'giorni'}`;
        break;
      case 'weekly':
        const days = weekDays.map((d) => weekDayNames[d]).join(', ');
        summary = `${intervalText}${interval === 1 ? 'Ogni settimana' : 'settimane'} • ${days}`;
        break;
      case 'monthly':
        summary = `${intervalText}${interval === 1 ? 'Ogni mese' : 'mesi'} • giorno ${monthDay}`;
        break;
      case 'yearly':
        summary = `${intervalText}${interval === 1 ? 'Ogni anno' : 'anni'} • ${monthNames[yearMonth]} ${monthDay}`;
        break;
    }

    if (endType === 'date' && endDate) {
      summary += ` fino al ${new Date(endDate).toLocaleDateString('it-IT')}`;
    } else if (endType === 'occurrences') {
      summary += ` per ${occurrences} occorrenze`;
    }

    return summary;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-blue-500" />
                Configurazione Ripetizione
              </h2>
              <p className="text-sm text-gray-500 mt-1">{getRepeatSummary()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {nextOccurrences.length > 0 && (
            <div className="absolute top-5 right-16 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {nextOccurrences.length} occorrenze
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          
          {/* Repeat Type Selection */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <span>🔄</span>
              Tipo di Ripetizione
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { value: 'none' as const, label: 'Nessuna', icon: '🚫' },
                { value: 'daily' as const, label: 'Giornaliera', icon: '📅' },
                { value: 'weekly' as const, label: 'Settimanale', icon: '📊' },
                { value: 'monthly' as const, label: 'Mensile', icon: '🗓️' },
                { value: 'yearly' as const, label: 'Annuale', icon: '🎂' },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setRepeatType(value)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all border-2',
                    repeatType === value
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <div className="text-lg mb-1">{icon}</div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          {repeatType !== 'none' && (
            <>
              {/* Basic Settings */}
              <div className="mb-8 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <span>⚙️</span>
                  Impostazioni Base
                </h3>

                {/* Interval */}
                <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                  <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                    <span>🔢</span>
                    Intervallo
                  </label>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={interval}
                        onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {repeatType === 'daily' && (interval === 1 ? 'giorno' : 'giorni')}
                        {repeatType === 'weekly' && (interval === 1 ? 'settimana' : 'settimane')}
                        {repeatType === 'monthly' && (interval === 1 ? 'mese' : 'mesi')}
                        {repeatType === 'yearly' && (interval === 1 ? 'anno' : 'anni')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weekly: Day Selection */}
                {repeatType === 'weekly' && (
                  <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                    <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                      <span>📆</span>
                      Giorni
                    </label>
                    <div className="flex-1">
                      <div className="grid grid-cols-7 gap-2">
                        {weekDayNames.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => toggleWeekDay(index)}
                            className={cn(
                              'px-2 py-2 rounded-lg text-xs font-medium transition-all border',
                              weekDays.includes(index)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            )}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Monthly: Day Selection */}
                {repeatType === 'monthly' && (
                  <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                    <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                      <span>📅</span>
                      Giorno
                    </label>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={monthDay}
                        onChange={(e) => setMonthDay(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Yearly: Month + Day */}
                {repeatType === 'yearly' && (
                  <>
                    <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                      <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                        <span>📅</span>
                        Mese
                      </label>
                      <div className="flex-1">
                        <select
                          value={yearMonth}
                          onChange={(e) => setYearMonth(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {monthNames.map((month, index) => (
                            <option key={index} value={index}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                      <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                        <span>📅</span>
                        Giorno
                      </label>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={monthDay}
                          onChange={(e) => setMonthDay(parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Start Date */}
                <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                  <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Inizio
                  </label>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Time Range */}
                <div className="flex items-start hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors">
                  <label className="w-36 pt-2 text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Orario
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* End Settings */}
              <div className="mb-8 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <span>🏁</span>
                  Termine
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="endType"
                      checked={endType === 'never'}
                      onChange={() => setEndType('never')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Mai</span>
                  </label>

                  <label className="flex items-center gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="endType"
                      checked={endType === 'date'}
                      onChange={() => setEndType('date')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Il giorno</span>
                    {endType === 'date' && (
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    )}
                  </label>

                  <label className="flex items-center gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="endType"
                      checked={endType === 'occurrences'}
                      onChange={() => setEndType('occurrences')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Dopo</span>
                    {endType === 'occurrences' && (
                      <>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={occurrences}
                          onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                          className="ml-2 w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <span className="text-sm">occorrenze</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Options */}
              <div className="mb-8 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <span>💼</span>
                  Opzioni
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workDaysOnly}
                      onChange={(e) => setWorkDaysOnly(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Solo giorni lavorativi (escludi weekend)</span>
                  </label>

                  <label className="flex items-center gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={excludeHolidays}
                      onChange={(e) => setExcludeHolidays(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Escludi festività</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              {nextOccurrences.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>📅</span>
                    Prossime occorrenze
                    <span className="text-sm font-normal text-gray-500">
                      ({showAllOccurrences
                        ? nextOccurrences.length
                        : `prime ${Math.min(10, nextOccurrences.length)} di ${nextOccurrences.length}`})
                    </span>
                  </h3>
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                    {nextOccurrences
                      .slice(0, showAllOccurrences ? nextOccurrences.length : 10)
                      .map((date, i) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        return (
                          <div
                            key={i}
                            className={cn(
                              'flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors',
                              isToday
                                ? 'bg-green-100 text-green-800 font-medium'
                                : isWeekend
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-white text-gray-700'
                            )}
                          >
                            <span className="font-mono text-xs text-gray-400 w-6">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1">
                              {date.toLocaleDateString('it-IT', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'short',
                                year: i === 0 ? 'numeric' : undefined,
                              })}
                              {isToday && <span className="ml-2 text-xs">• Oggi</span>}
                            </span>
                            <span className="text-xs text-gray-400">
                              {startTime} - {endTime}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  {nextOccurrences.length > 10 && (
                    <button
                      onClick={() => setShowAllOccurrences(!showAllOccurrences)}
                      className="w-full text-center mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showAllOccurrences
                        ? 'Mostra meno'
                        : `Mostra tutte (${nextOccurrences.length})`}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
              Esc
            </kbd>{' '}
            per chiudere •{' '}
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono ml-1">
              Ctrl
            </kbd>
            +
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
              Enter
            </kbd>{' '}
            per salvare
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Annulla
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={repeatType === 'none'}>
              <span>💾</span>
              Salva configurazione
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskRepeatModal;
