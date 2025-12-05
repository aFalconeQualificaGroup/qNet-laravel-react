import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { OriginalTaskType } from '@/components/AG-grid/helper';

const locales = { 'it': it };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: {
    status: number;
    priority?: any;
    description?: string;
    customer?: string;
    assignee?: string;
  };
}

interface TaskCalendarProps {
  tasks?: OriginalTaskType[];
}

export function TaskCalendar({ tasks: initialTasks }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasks = initialTasks || [];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(format(today, 'yyyy-MM-dd'));
    setCurrentDate(today);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const events: CalendarEvent[] = useMemo(() => {
    console.log('📅 Parsing tasks for calendar:', tasks.length);
    
    return tasks.map((task) => {
      let eventDate: Date;
      
      try {
        if (task.endtask) {
          eventDate = new Date(task.endtask + 'T12:00:00');
        } else if (task.datatask) {
          eventDate = new Date(task.datatask);
        } else {
          console.warn('⚠️ Task without date:', task.id);
          eventDate = new Date();
        }
        
        if (isNaN(eventDate.getTime())) {
          console.warn('⚠️ Invalid date for task:', task.id, task.endtask);
          eventDate = new Date();
        }
      } catch (error) {
        console.error('❌ Error parsing date for task:', task.id, error);
        eventDate = new Date();
      }

      return {
        id: task.id,
        title: task.title || 'Task senza titolo',
        start: eventDate,
        end: eventDate,
        allDay: true,
        resource: {
          status: task.status,
          priority: task.priority,
          description: task.description || undefined,
          customer: task.customer?.name,
          assignee: task.assigned_to_user 
            ? `${task.assigned_to_user.name} ${task.assigned_to_user.last_name || ''}`
            : undefined,
        },
      };
    });
  }, [tasks]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource?.status;
    
    const statusColors: Record<number, { backgroundColor: string; color: string; borderColor: string }> = {
      0: { 
        backgroundColor: '#3b82f6', // blue-500
        color: '#ffffff',
        borderColor: '#2563eb' // blue-600
      },
      1: { 
        backgroundColor: '#f59e0b', // amber-500
        color: '#ffffff',
        borderColor: '#d97706' // amber-600
      },
      2: { 
        backgroundColor: '#10b981', // green-500
        color: '#ffffff',
        borderColor: '#059669' // green-600
      },
    };

    const colors = statusColors[status ?? 0] || statusColors[0];

    return {
      style: {
        backgroundColor: colors.backgroundColor,
        color: colors.color,
        borderColor: colors.borderColor,
        borderRadius: '4px',
        border: '2px solid',
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        padding: '2px 4px',
      },
    };
  };

  const messages = {
    today: 'Oggi',
    previous: 'Indietro',
    next: 'Avanti',
    month: 'Mese',
    week: 'Settimana',
    day: 'Giorno',
    date: 'Data',
    time: 'Ora',
    event: 'Evento',
    showMore: (total: number) => `+ Altri ${total}`,
    noEventsInRange: 'Nessun task in questo periodo',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end p-4 bg-card border border-border rounded-lg">
        <div className="flex-1 w-full sm:w-auto">
          <Label htmlFor="calendar-date" className="text-sm font-medium mb-2 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Vai alla data
          </Label>
          <Input
            id="calendar-date"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button
          onClick={handleTodayClick}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Torna a Oggi
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {tasks.length} task totali • {events.length} visualizzati
        </div>
      </div>

      <div className="h-[700px] w-full bg-card border border-border rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="it"
          messages={messages}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          view={currentView}
          date={currentDate}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          popup
          selectable
          onSelectEvent={(event) => {
            const taskId = (event as CalendarEvent).id;
            console.log('📝 Selected task:', taskId, event);
          }}
          onSelectSlot={(slotInfo) => {
            console.log('➕ Selected slot:', slotInfo.start);
          }}
        />
      </div>
    </div>
  );
}
