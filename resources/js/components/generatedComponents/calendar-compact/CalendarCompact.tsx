import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, X, ChevronLeft, ChevronRight, HelpCircle, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ==================== TYPES ====================
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  isWholeDay: boolean;
}

export interface CalendarCompactProps {
  /** Controlla la visibilità del calendario */
  isOpen: boolean;
  /** Callback per chiudere il calendario */
  onClose: () => void;
  /** Callback quando viene confermata la selezione */
  onSelectRange: (range: DateRange) => void;
  /** Data di inizio preselezionata */
  startDate?: Date | string | null;
  /** Data di fine preselezionata */
  endDate?: Date | string | null;
  /** Orario di inizio preselezionato */
  startTime?: string;
  /** Orario di fine preselezionato */
  endTime?: string;
  /** Se true, il calendario si apre in modalità "Giornata Intera" */
  defaultIsWholeDay?: boolean;
}

interface CalendarDay {
  day: number | string;
  date: Date | null;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isBothDates: boolean;
  isDisabled: boolean;
}

type ActiveType = 'start' | 'end';

// ==================== CONSTANTS ====================
const DAY_NAMES_IT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const MONTH_NAMES_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const QUICK_ACTIONS = [
  { label: 'Oggi', value: 'oggi', icon: '📌' },
  { label: 'Domani', value: 'domani', icon: '⏰' },
  { label: 'Dopodomani', value: 'dopodomani', icon: '📆' },
  { label: '+1 settimana', value: 'settimana', icon: '📊' },
  { label: '+2 settimane', value: 'dueset', icon: '📈' },
  { label: '+1 mese', value: 'mese', icon: '🗓️' },
] as const;

const QUICK_ACTIONS_SECONDARY = [
  { label: 'Lunedì', value: 'lunedi', icon: '🔵' },
  { label: 'Venerdì', value: 'venerdi', icon: '🎉' },
  { label: 'Fine mese', value: 'fine_mese', icon: '📝' },
] as const;

const QUICK_TIMES = ['09:00', '12:00', '15:00', '18:00'];

// ==================== COMPONENT ====================
export const CalendarCompact: React.FC<CalendarCompactProps> = ({
  isOpen,
  onClose,
  onSelectRange,
  startDate = null,
  endDate = null,
  startTime = '',
  endTime = '',
  defaultIsWholeDay = false,
}) => {
  // Normalizza i valori in Date | null
  const normalizeDate = (d: Date | string | null | undefined): Date | null => {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === 'string') return d ? new Date(d) : null;
    return null;
  };
  // State
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(normalizeDate(startDate));
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(normalizeDate(endDate));
  const [selectedStartTime, setSelectedStartTime] = useState<string>(startTime || '');
  const [selectedEndTime, setSelectedEndTime] = useState<string>(endTime || '');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [activeType, setActiveType] = useState<ActiveType>('end');
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [selectingMonth, setSelectingMonth] = useState<boolean>(false);
  const [selectingYear, setSelectingYear] = useState<boolean>(false);
  const [isWholeDay, setIsWholeDay] = useState<boolean>(defaultIsWholeDay);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [lastClickDate, setLastClickDate] = useState<string | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Sync props with state
  useEffect(() => {
    setSelectedStartDate(normalizeDate(startDate));
    setSelectedEndDate(normalizeDate(endDate));
    setSelectedStartTime(startTime || '');
    setSelectedEndTime(endTime || '');
  }, [startDate, endDate, startTime, endTime]);

  // Combina data e ora in un unico oggetto Date
  const combineDateAndTime = (date: Date | null, time: string) => {
    if (!date) return null;
    if (!time) return new Date(date); // Solo la data
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0, minutes || 0, 0, 0);
    return newDate;
  };

  // Confirm selection
  // Qui vengono generati i Date completi di ora
  const confirmSelection = useCallback(() => {
    const start = isWholeDay ? (selectedStartDate ? new Date(selectedStartDate) : null) : combineDateAndTime(selectedStartDate, selectedStartTime);
    const end = isWholeDay ? (selectedEndDate ? new Date(selectedEndDate) : null) : combineDateAndTime(selectedEndDate, selectedEndTime);
   /* alert(
      `Valori selezionati:\n` +
      `startDate: ${start}\n` +
      `endDate: ${end}\n` +
      `startTime: ${isWholeDay ? '' : selectedStartTime}\n` +
      `endTime: ${isWholeDay ? '' : selectedEndTime}\n` +
      `isWholeDay: ${isWholeDay}`
    );*/
    onSelectRange({
      startDate: start,
      endDate: end,
      startTime: isWholeDay ? '' : selectedStartTime,
      endTime: isWholeDay ? '' : selectedEndTime,
      isWholeDay,
    });
  }, [selectedStartDate, selectedEndDate, selectedStartTime, selectedEndTime, isWholeDay, onSelectRange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'Enter':
          confirmSelection();
          break;
        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            const today = new Date();
            selectDate(today);
            setCurrentMonth(today.getMonth());
            setCurrentYear(today.getFullYear());
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, confirmSelection, onClose]);

  // Click outside to confirm
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        confirmSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, confirmSelection]);

  // Date selection logic
  const selectDate = useCallback((date: Date) => {
    const now = Date.now();
    const clickedDateStr = date.toDateString();

    // Double click detection (< 500ms same date)
    if (lastClickTime && now - lastClickTime < 500 && lastClickDate === clickedDateStr) {
      setSelectedStartDate(date);
      setSelectedEndDate(date);
      setActiveType('end');
      setLastClickTime(null);
      setLastClickDate(null);
      return;
    }

    setLastClickTime(now);
    setLastClickDate(clickedDateStr);

    // Selection based on activeType
    if (activeType === 'start') {
      if (selectedEndDate && date > selectedEndDate) {
        setSelectedStartDate(selectedEndDate);
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
      }
    } else {
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  }, [activeType, selectedStartDate, selectedEndDate, lastClickTime, lastClickDate]);

  // Time selection
  const selectTime = useCallback((time: string) => {
    if (activeType === 'start') {
      setSelectedStartTime(time);
    } else {
      setSelectedEndTime(time);
    }
  }, [activeType]);

  // Clear dates
  const clearDates = useCallback(() => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setActiveType('end');
  }, []);

  // Quick select
  const selectQuick = useCallback((type: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date();

    switch (type) {
      case 'oggi':
        targetDate.setTime(today.getTime());
        break;
      case 'domani':
        targetDate.setDate(targetDate.getDate() + 1);
        break;
      case 'dopodomani':
        targetDate.setDate(targetDate.getDate() + 2);
        break;
      case 'settimana':
        targetDate.setDate(targetDate.getDate() + 7);
        break;
      case 'dueset':
        targetDate.setDate(targetDate.getDate() + 14);
        break;
      case 'mese':
        targetDate.setMonth(targetDate.getMonth() + 1);
        break;
      case 'lunedi':
        const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + daysUntilMonday);
        break;
      case 'venerdi':
        const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + daysUntilFriday);
        break;
      case 'fine_mese':
        targetDate.setTime(new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime());
        break;
    }

    if (activeType === 'start') {
      if (selectedEndDate && targetDate > selectedEndDate) {
        setSelectedStartDate(selectedEndDate);
        setSelectedEndDate(targetDate);
      } else {
        setSelectedStartDate(targetDate);
      }
    } else {
      if (selectedStartDate && targetDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(targetDate);
      } else {
        setSelectedEndDate(targetDate);
      }
    }

    setCurrentMonth(targetDate.getMonth());
    setCurrentYear(targetDate.getFullYear());
  }, [activeType, selectedStartDate, selectedEndDate]);

  // Format header date
  const formatHeaderDate = useCallback((date: Date | null, time: string) => {
    if (!date) return null;
    const d = new Date(date);
    const dayName = DAY_NAMES_IT[d.getDay()];
    const dateStr = `${dayName} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { dateStr, time };
  }, []);

  // Generate calendar days
  const generateCalendarDays = useCallback((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty days at start (week starts Monday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startDay; i++) {
      days.push({
        day: '',
        date: null,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isBothDates: false,
        isDisabled: true,
      });
    }

    // Days of the month
    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);
      const isStartSelected = selectedStartDate && date.getTime() === selectedStartDate.getTime();
      const isEndSelected = selectedEndDate && date.getTime() === selectedEndDate.getTime();
      const isSelected = isStartSelected || isEndSelected;
      const isInRange = selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate;
      const isBothDates = selectedStartDate && selectedEndDate && 
        selectedStartDate.getTime() === selectedEndDate.getTime() && 
        date.getTime() === selectedStartDate.getTime();

      days.push({
        day: i,
        date,
        isToday: date.getTime() === today.getTime(),
        isSelected: !!isSelected,
        isInRange: !!isInRange,
        isBothDates: !!isBothDates,
        isDisabled: false,
      });
    }

    return days;
  }, [currentYear, currentMonth, selectedStartDate, selectedEndDate]);

  // Generate time slots
  const generateTimeSlots = useCallback((): string[] => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      const hour = String(h).padStart(2, '0');
      times.push(`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`);
    }
    return times;
  }, []);

  // Navigation
  const prevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }, [currentMonth, currentYear]);

  const nextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }, [currentMonth, currentYear]);

  if (!isOpen) return null;

  const startDisplay = formatHeaderDate(selectedStartDate, selectedStartTime);
  const endDisplay = formatHeaderDate(selectedEndDate, selectedEndTime);
  const isSameDaySelection = selectedStartDate && selectedEndDate && 
    selectedStartDate.toDateString() === selectedEndDate.toDateString();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={confirmSelection} />
      
      {/* Calendar Popup */}
      <div
        ref={calendarRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-auto min-w-[400px] max-w-[95vw] max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl border border-gray-200"
        style={{ animation: 'calendarSlideDown 0.2s ease-out' }}
      >
        <style>{`
          @keyframes calendarSlideDown {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>

        {/* Header Blu */}
        <div className="bg-blue-600 text-white p-3 space-y-2">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center hover:bg-blue-700 rounded transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              {selectingMonth ? (
                <select
                  value={currentMonth}
                  onChange={(e) => {
                    setCurrentMonth(parseInt(e.target.value));
                    setSelectingMonth(false);
                  }}
                  onBlur={() => setSelectingMonth(false)}
                  className="text-sm bg-blue-700 text-white border-0 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                >
                  {MONTH_NAMES_IT.map((month, idx) => (
                    <option key={idx} value={idx} className="bg-blue-700">
                      {month}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectingMonth(true)}
                  className="text-sm font-bold hover:underline transition-all"
                >
                  {MONTH_NAMES_IT[currentMonth]}
                </button>
              )}

              {selectingYear ? (
                <select
                  value={currentYear}
                  onChange={(e) => {
                    setCurrentYear(parseInt(e.target.value));
                    setSelectingYear(false);
                  }}
                  onBlur={() => setSelectingYear(false)}
                  className="text-sm bg-blue-700 text-white border-0 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                >
                  {[...Array(21)].map((_, i) => {
                    const year = 2020 + i;
                    return (
                      <option key={year} value={year} className="bg-blue-700">
                        {year}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectingYear(true)}
                  className="text-sm font-bold hover:underline transition-all"
                >
                  {currentYear}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-blue-700 rounded transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-700 rounded transition-colors text-xs"
                title="Mostra/nascondi shortcuts"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Selected Dates Display */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={cn('flex items-center gap-1 text-sm', isSameDaySelection && 'opacity-70')}>
                {startDisplay ? (
                  <>
                    <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{startDisplay.dateStr}</span>
                    {startDisplay.time && !isWholeDay && (
                      <>
                        <span className="opacity-70">•</span>
                        <span className="text-xs opacity-80">{startDisplay.time}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-xs opacity-70">Inizio: --</span>
                )}
              </div>

              {startDisplay && endDisplay && (
                <ChevronRight className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
              )}

              <div className={cn('flex items-center gap-1 text-sm', isSameDaySelection && 'opacity-70')}>
                {endDisplay ? (
                  <>
                    <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{endDisplay.dateStr}</span>
                    {endDisplay.time && !isWholeDay && (
                      <>
                        <span className="opacity-70">•</span>
                        <span className="text-xs opacity-80">{endDisplay.time}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-xs opacity-70">Fine: --</span>
                )}
              </div>
            </div>

            {/* Pulsante clearDates rimosso: la gestione reset è ora nel form genitore */}
          </div>
        </div>

        {/* Shortcuts Panel */}
        {showShortcuts && (
          <div className="mx-3 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800 mb-2">⌨️ Shortcuts Tastiera</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono">ESC</kbd> Chiudi
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono">Enter</kbd> Conferma
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono">T</kbd> Oggi
                </div>
                <div className="col-span-2 mt-1 text-gray-500">Doppio click: Stesso giorno</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex">
          {/* Quick Select Sidebar */}
          <div className="w-[130px] bg-gray-50 p-2 border-r border-gray-200">
            <h4 className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Rapido</h4>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((quick) => (
                <button
                  type="button"
                  key={quick.value}
                  onClick={() => selectQuick(quick.value)}
                  className="w-full text-left px-2 py-1.5 text-[10px] rounded bg-white border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium"
                >
                  <span className="mr-1">{quick.icon}</span>
                  {quick.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-2" />

              {QUICK_ACTIONS_SECONDARY.map((quick) => (
                <button
                  type="button"
                  key={quick.value}
                  onClick={() => selectQuick(quick.value)}
                  className="w-full text-left px-2 py-1.5 text-[10px] rounded bg-white border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium"
                >
                  <span className="mr-1">{quick.icon}</span>
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="flex-1 p-3">
            {/* Type Selector */}
            <div className="flex gap-2 mb-3 items-center">
                  <button
                    type="button"
                    onClick={() => setActiveType('start')}
                    className={cn(
                  'px-3 py-1 text-[10px] font-semibold rounded border transition-colors',
                  activeType === 'start'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                INIZIO
              </button>
                  <button
                    type="button"
                    onClick={() => setActiveType('end')}
                    className={cn(
                  'px-3 py-1 text-[10px] font-semibold rounded border transition-colors',
                  activeType === 'end'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                FINE
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-lg p-2">
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-px text-[10px] font-semibold text-gray-500 mb-1">
                {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, idx) => (
                  <div key={idx} className="text-center py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px mb-2">
                {generateCalendarDays().map((day, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => day.date && selectDate(day.date)}
                    disabled={day.isDisabled}
                    className={cn(
                      'aspect-square flex items-center justify-center text-[11px] rounded transition-all relative font-medium',
                      day.isDisabled && 'text-gray-300 cursor-not-allowed',
                      !day.isDisabled && 'cursor-pointer hover:bg-gray-100 hover:scale-110',
                      day.isToday && !day.isSelected && 'bg-amber-100 text-amber-700 font-bold',
                      day.isSelected && 'bg-blue-600 text-white font-bold',
                      day.isInRange && !day.isSelected && 'bg-blue-100'
                    )}
                  >
                    {day.day}
                    {day.isBothDates && (
                      <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Time Picker */}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Seleziona Orario
                  </h4>
                  <button
                    onClick={() => setIsWholeDay(!isWholeDay)}
                    className={cn(
                      'text-[10px] px-2 py-1 rounded transition-colors font-medium',
                      isWholeDay
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    Intero Giorno
                  </button>
                </div>

                {!isWholeDay && (
                  <>
                    <div className="text-[9px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
                      {activeType === 'start' ? 'Ora Inizio:' : 'Ora Fine:'}
                    </div>

                    {/* Quick Time Slots */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {QUICK_TIMES.map((time) => {
                        const isActive = (activeType === 'start' ? selectedStartTime : selectedEndTime) === time;
                        return (
                          <button
                            type="button"
                            key={time}
                            onClick={() => selectTime(time)}
                            className={cn(
                              'text-center text-[10px] py-1 rounded transition-colors font-medium',
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-blue-600 hover:text-white'
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Select */}
                    <select
                      value={activeType === 'start' ? selectedStartTime : selectedEndTime}
                      onChange={(e) => selectTime(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleziona orario</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Annulla
          </Button>
          <Button type="button" size="sm" onClick={confirmSelection} className="text-xs bg-blue-600 hover:bg-blue-700">
            Conferma
          </Button>
        </div>
      </div>
    </>
  );
};

export default CalendarCompact;
