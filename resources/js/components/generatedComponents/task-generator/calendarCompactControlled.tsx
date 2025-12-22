import React, { useEffect, useRef, useState } from 'react';
import './calendar-compact.css';

// ===================== TYPES =====================
export type CalendarValue = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  isWholeDay: boolean;
  hasRepetition: boolean;
};

export type CalendarCompactControlledProps = {
  isOpen: boolean;
  value: CalendarValue;
  onChange: (v: CalendarValue) => void;
  onClose: () => void;
};

// ===================== CONSTANTS =====================
const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const monthNames = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

// ===================== COMPONENT =====================
export default function CalendarCompactControlled({
  isOpen,
  value,
  onChange,
  onClose
}: CalendarCompactControlledProps) {
  const { startDate, endDate, startTime, endTime, isWholeDay, hasRepetition } = value;

  // UI STATE ONLY
  const [currentMonth, setCurrentMonth] = useState((endDate ?? new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState((endDate ?? new Date()).getFullYear());
  const [activeType, setActiveType] = useState<'start' | 'end'>('end');
  const [showShortcuts, setShowShortcuts] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<CalendarValue>) =>
    onChange({ ...value, ...patch });

  // ===================== LOGIC =====================
  const selectDate = (date: Date) => {
    if (!startDate && !endDate) {
      update({ endDate: date });
      setActiveType('end');
      return;
    }

    if (endDate && !startDate) {
      if (date < endDate) {
        update({ startDate: date });
        setActiveType('start');
      } else if (date > endDate) {
        update({ startDate: endDate, endDate: date });
        setActiveType('end');
      }
      return;
    }

    if (startDate && endDate) {
      update({ startDate: null, endDate: date });
      setActiveType('end');
    }
  };

  const clearDates = () =>
    update({ startDate: null, endDate: null, startTime: '', endTime: '' });

  const selectTime = (t: string) =>
    activeType === 'start'
      ? update({ startTime: t })
      : update({ endTime: t });

  // click outside
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ===================== CALENDAR DAYS =====================
  const calendarDays = () => {
    const out: any[] = [];
    const first = new Date(currentYear, currentMonth, 1).getDay();
    const last = new Date(currentYear, currentMonth + 1, 0).getDate();
    const offset = first === 0 ? 6 : first - 1;

    for (let i = 0; i < offset; i++) out.push({ empty: true });

    for (let d = 1; d <= last; d++) {
      const date = new Date(currentYear, currentMonth, d);
      date.setHours(0, 0, 0, 0);

      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        (startDate && date.getTime() === startDate.getTime()) ||
        (endDate && date.getTime() === endDate.getTime());
      const isInRange = startDate && endDate && date >= startDate && date <= endDate;

      out.push({ d, date, isToday, isSelected, isInRange });
    }
    return out;
  };

  // ===================== JSX (PIXEL PERFECT) =====================
  return (
    <div className="calendar-popup show" ref={ref}>

      {/* HEADER */}
      <div className="bg-blue-600 text-white p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="nav-arrow">
            <button
              className="text-white hover:bg-blue-700 rounded px-2 py-1"
              onClick={() => setCurrentMonth(m => (m === 0 ? 11 : m - 1))}
            >
              ←
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-sm font-bold month-year-clickable">
              {monthNames[currentMonth]}
            </span>
            <span className="text-sm font-bold month-year-clickable">
              {currentYear}
            </span>
          </div>

          <div className="nav-arrow">
            <button
              className="text-white hover:bg-blue-700 rounded px-2 py-1"
              onClick={() => setCurrentMonth(m => (m === 11 ? 0 : m + 1))}
            >
              →
            </button>
          </div>

          <button
            className="help-button ml-2"
            title="Mostra/nascondi shortcuts"
            onClick={() => setShowShortcuts(v => !v)}
          >
            ?
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-baseline gap-1">
              {startDate ? (
                <span className="header-date">📅 {dayNames[startDate.getDay()]} {String(startDate.getDate()).padStart(2,'0')}/{String(startDate.getMonth()+1).padStart(2,'0')}</span>
              ) : (
                <span className="header-time">Inizio: --</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              {endDate ? (
                <span className="header-date">📅 {dayNames[endDate.getDay()]} {String(endDate.getDate()).padStart(2,'0')}/{String(endDate.getMonth()+1).padStart(2,'0')}</span>
              ) : (
                <span className="header-time">Fine: --</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SHORTCUTS */}
      <div className={`shortcuts-panel ${showShortcuts ? '' : 'hidden'}`}>
        <div className="text-gray-600">
          <strong>Shortcuts tastiera:</strong><br />
          • ESC: Chiudi<br />
          • Enter: Conferma<br />
          • T: Oggi<br />
          • Doppio click: Stesso giorno
        </div>
      </div>

      <div className="flex">

        {/* LEFT */}
        <div className="w-1/3 bg-gray-50 p-2 border-r">
          <h4 className="text-xs font-bold text-gray-500 mb-1">RAPIDO</h4>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-2">
          <div className="flex gap-2 mb-2 items-center">
            <button className={`date-type-button ${activeType==='start'?'active':''}`} onClick={()=>setActiveType('start')}>INIZIO</button>
            <button className={`date-type-button ${activeType==='end'?'active':''}`} onClick={()=>setActiveType('end')}>FINE</button>
            <button className="text-[10px] px-2 py-1 rounded transition-all ml-auto text-gray-500 hover:bg-gray-100">Ripetizione</button>
          </div>

          <div className="border rounded-lg p-2">
            <div className="calendar-grid text-xs font-semibold text-gray-500 mb-1">
              <div>L</div><div>M</div><div>M</div><div>G</div><div>V</div><div>S</div><div>D</div>
            </div>

            <div className="calendar-grid mb-2">
              {calendarDays().map((x,i)=> (
                <div
                  key={i}
                  onClick={()=>x.date && selectDate(x.date)}
                  className={`calendar-day ${x.isToday?'today':''} ${x.isSelected?'selected':''}`}
                  style={{ position:'relative', backgroundColor: x.isInRange && !x.isSelected ? '#E0F2FE' : undefined }}
                >
                  {x.d}
                </div>
              ))}
            </div>

            <div className="border-t pt-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-gray-500">SELEZIONA ORARIO</h4>
                <button
                  className={`text-[10px] px-2 py-1 rounded transition-all ${isWholeDay ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  onClick={()=>update({ isWholeDay: !isWholeDay })}
                >
                  Intero Giorno
                </button>
              </div>

              {!isWholeDay && (
                <>
                  <div className="text-[9px] text-gray-500 mb-1">ORA {activeType === 'start' ? 'INIZIO' : 'FINE'}:</div>
                  <div className="grid grid-cols-4 gap-1 mb-1">
                    {['09:00','12:00','15:00','18:00'].map(t=> (
                      <div key={t} className={`time-slot ${(activeType==='start'?startTime:endTime)===t?'selected':''}`} onClick={()=>selectTime(t)}>{t}</div>
                    ))}
                  </div>

                  <select
                    className="w-full px-2 py-1 text-xs border rounded"
                    value={activeType==='start'?startTime:endTime}
                    onChange={e=>selectTime(e.target.value)}
                  >
                    <option value="">Seleziona orario</option>
                    {Array.from({length:24}).flatMap((_,h)=>['00','15','30','45','59'].map(m=>`${String(h).padStart(2,'0')}:${m}`))
                      .map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t p-2 bg-gray-50">
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-100" onClick={onClose}>Annulla</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700" onClick={onClose}>Conferma</button>
        </div>
      </div>
    </div>
  );
}
