import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { router } from '@inertiajs/react';
import * as tasksRoutes from '@/routes/tasks';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { OriginalTaskType } from '@/components/AG-grid/helper';

/**
 * Configurazione localizzazione per il calendario
 * Usa date-fns per formattare le date in italiano
 */
const locales = {
  'it': it,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunedì come primo giorno
  getDay,
  locales,
});

/**
 * Interfaccia per gli eventi del calendario
 * Estende Event di react-big-calendar con i dati del task
 */
interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    status: number;
    priority?: any;
    description?: string;
    customer?: string;
    assignee?: string;
  };
}

interface TaskCalendarProps {
  tasks: OriginalTaskType[];
}

/**
 * Componente Calendario per visualizzare i task
 * Converte i dati dei task in eventi del calendario
 */
export function TaskCalendar({ tasks }: TaskCalendarProps) {
  /**
   * Converte i task in eventi del calendario
   * Usa useMemo per evitare ricalcoli non necessari
   */
  const events: CalendarEvent[] = useMemo(() => {
    console.log('📅 Parsing tasks for calendar:', tasks.length);
    
    return tasks.map((task) => {
      // Parsing delle date
      // Combina datatask + timetask per ottenere data/ora completa
      let startDateTime: Date;
      let endDateTime: Date;
      
      try {
        if (task.datatask) {
          // Formato atteso: YYYY-MM-DD
          const dateTimeParts = task.datatask.split(' ');
          const datePart = dateTimeParts[0];
          const timePart = task.timetask || '00:00:00';
          startDateTime = new Date(`${datePart}T${timePart}`);
        } else {
          startDateTime = new Date();
        }
        
        if (task.datataskend) {
          const dateTimeParts = task.datataskend.split(' ');
          const datePart = dateTimeParts[0];
          const timePart = task.timetaskend || '23:59:00';
          endDateTime = new Date(`${datePart}T${timePart}`);
        } else {
          endDateTime = new Date(startDateTime.getTime() + 3600000); // +1 ora
        }
        
        // Verifica se le date sono valide
        if (isNaN(startDateTime.getTime())) {
          console.warn('⚠️ Invalid start date for task:', task.id, task.datatask);
          startDateTime = new Date();
        }
        if (isNaN(endDateTime.getTime())) {
          console.warn('⚠️ Invalid end date for task:', task.id, task.datataskend);
          endDateTime = new Date(startDateTime.getTime() + 3600000);
        }
        
      } catch (error) {
        console.error('❌ Error parsing dates for task:', task.id, error);
        startDateTime = new Date();
        endDateTime = new Date(startDateTime.getTime() + 3600000);
      }

      return {
        id: task.id,
        title: task.title || 'Task senza titolo',
        start: startDateTime,
        end: endDateTime,
        resource: {
          status: task.status,
          priority: task.priority,
          description: task.description || undefined,
          customer: task.customer?.name,
          assignee: task.assigned_to_user 
            ? `${task.assigned_to_user.name} ${task.assigned_to_user.last_name}`
            : undefined,
        },
      };
    });
  }, [tasks]);

  /**
   * Personalizzazione dello stile degli eventi in base allo status
   */
  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource?.status;
    
    // Colori in base allo status
    const statusColors: Record<number, { backgroundColor: string; borderColor: string }> = {
      0: { backgroundColor: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' },      // Aperto
      1: { backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--secondary))' },  // In corso
      2: { backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' },         // Completato
    };

    const colors = statusColors[status ?? 0] || statusColors[0];

    return {
      style: {
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid',
        display: 'block',
      },
    };
  };

  /**
   * Messaggi personalizzati in italiano
   */
  const messages = {
    today: 'Oggi',
    previous: 'Indietro',
    next: 'Avanti',
    month: 'Mese',
    week: 'Settimana',
    day: 'Giorno',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Ora',
    event: 'Evento',
    showMore: (total: number) => `+ Altri ${total}`,
    noEventsInRange: 'Nessun task in questo periodo',
  };

  return (
    <div className="h-[700px] w-full">
      <style>{`
        /* Tailwind-based calendar styles */
        .rbc-calendar {
          font-family: inherit;
        }
        
        .rbc-toolbar {
          @apply flex flex-wrap justify-between items-center gap-4 pb-4 mb-4 border-b border-border;
        }
        
        .rbc-toolbar button {
          @apply px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm transition-colors hover:bg-secondary/80;
        }
        
        .rbc-toolbar button:active,
        .rbc-toolbar button.rbc-active {
          @apply bg-primary text-primary-foreground border-primary;
        }
        
        .rbc-toolbar-label {
          @apply text-lg font-semibold text-foreground;
        }
        
        .rbc-header {
          @apply p-3 font-semibold text-foreground border-b border-border bg-muted/30;
        }
        
        .rbc-month-view,
        .rbc-time-view,
        .rbc-agenda-view {
          @apply border border-border rounded-lg overflow-hidden bg-card;
        }
        
        .rbc-day-bg {
          @apply bg-card border border-border;
        }
        
        .rbc-day-bg:hover {
          @apply bg-muted/30;
        }
        
        .rbc-off-range-bg {
          @apply bg-muted/20;
        }
        
        .rbc-today {
          @apply bg-primary/10;
        }
        
        .rbc-date-cell {
          @apply p-2 text-right text-foreground;
        }
        
        .rbc-off-range {
          @apply text-muted-foreground;
        }
        
        .rbc-now .rbc-button-link {
          @apply font-bold text-primary;
        }
        
        .rbc-event {
          @apply px-2 py-1 text-xs cursor-pointer rounded my-0.5 mx-1;
        }
        
        .rbc-event:hover {
          @apply opacity-100 shadow-md;
        }
        
        .rbc-event-label {
          @apply text-xs;
        }
        
        .rbc-event-content {
          @apply font-medium;
        }
        
        .rbc-overlay {
          @apply bg-popover border border-border rounded-lg shadow-xl p-2;
        }
        
        .rbc-overlay-header {
          @apply p-2 border-b border-border font-semibold text-foreground;
        }
        
        .rbc-time-header-content {
          @apply border-l border-border;
        }
        
        .rbc-time-content {
          @apply border-t border-border;
        }
        
        .rbc-time-slot {
          @apply text-muted-foreground text-xs;
        }
        
        .rbc-current-time-indicator {
          @apply bg-destructive h-0.5;
        }
        
        .rbc-slot-selection {
          @apply bg-primary/30 border border-primary;
        }
        
        .rbc-agenda-view table {
          @apply w-full border-spacing-0;
        }
        
        .rbc-agenda-date-cell,
        .rbc-agenda-time-cell {
          @apply p-3 whitespace-nowrap text-muted-foreground text-sm;
        }
        
        .rbc-agenda-event-cell {
          @apply p-3 text-foreground;
        }
        
        .rbc-agenda-view table tbody > tr > td {
          @apply border-t border-border;
        }
        
        .rbc-agenda-view table tbody > tr > td + td {
          @apply border-l border-border;
        }
      `}</style>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="it"
        messages={messages}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        popup
        selectable
        onSelectEvent={(event) => {
          // 🎯 Naviga alla pagina di edit del task
          const taskId = (event as CalendarEvent).id;
          console.log('📝 Navigating to task:', taskId);
          router.visit(tasksRoutes.edit.url({ task: taskId }));
        }}
        onSelectSlot={(slotInfo) => {
          // 🎯 Crea nuovo task con data precompilata
          console.log('➕ Creating new task for date:', slotInfo.start);
          router.visit(tasksRoutes.create.url(), {
            data: {
              datatask: format(slotInfo.start, 'yyyy-MM-dd'),
              timetask: format(slotInfo.start, 'HH:mm:ss'),
            },
          });
        }}
      />
    </div>
  );
}
