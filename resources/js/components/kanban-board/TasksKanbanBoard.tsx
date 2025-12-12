import { KanbanBoard } from './kanbanBoard';
import { KanbanCard } from './boardData';
import type { OriginalTaskType } from '@/components/AG-grid/helper';
import { useCallback, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import tasksRoutes from '@/routes/tasks';
import { toast } from 'sonner';

interface TasksByDeadline {
    overdue: OriginalTaskType[];
    today: OriginalTaskType[];
    week: OriginalTaskType[];
    month: OriginalTaskType[];
}

/**
 * Componente Kanban specifico per i Tasks con scadenze
 */
export function TasksKanbanBoard() {

    const form = useForm({
        endtask: '',
    });

    const { flash } = usePage<{ flash: { success?: string; error?: string; warning?: string } }>().props;

    // Gestione flash messages
    useEffect(() => {
        if (flash?.success) {
            console.log('✅ Success:', flash.success);
            toast.success(flash.success);
        }
        if (flash?.error) {
            console.error('❌ Error:', flash.error);
            toast.error(flash.error);
        }
    }, [flash]);

    const mapTasksToCards = useCallback((tasks: OriginalTaskType[]): KanbanCard[] => {
        return tasks.map(task => ({
            id: task.id.toString(),
            title: task.title || 'Senza titolo',
            description: task.description || '',
            dueDate: task.endtask || undefined,
            assignee: task.assigned_to_user
                ? `${task.assigned_to_user.name} ${task.assigned_to_user.last_name || ''}`.trim()
                : undefined
        }));
    }, []);

    const dataMapper = useCallback((data: TasksByDeadline): Record<string, KanbanCard[]> => ({
        overdue: mapTasksToCards(data.overdue),
        today: mapTasksToCards(data.today),
        week: mapTasksToCards(data.week),
        month: mapTasksToCards(data.month)
    }), [mapTasksToCards]);

    const calculateNewDate = useCallback((columnId: string): string => {
        const now = new Date();
        
        // Funzione helper per formattare la data senza problemi di timezone
        const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        switch (columnId) {
            case 'overdue':
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                return formatDate(yesterday);

            case 'today':
                return formatDate(now);

            case 'week':
                const endOfWeek = new Date(now);
                const dayOfWeek = endOfWeek.getDay();
                const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
                endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
                return formatDate(endOfWeek);

            case 'month':
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                return formatDate(endOfMonth);

            default:
                return formatDate(now);
        }
    }, []);

    const handleCardMoved = (cardId: string, fromColumn: string, toColumn: string, newDate: string) => {
        console.log(`Task ${cardId} spostato da ${fromColumn} a ${toColumn}, nuova scadenza: ${newDate}`);

        router.put(tasksRoutes.update(cardId).url, {
            endtask: newDate
        }, {
            preserveScroll: true,
            preserveState: true,
            only: ['flash'],
        });
        
    };

    const filterCards = useCallback((card: KanbanCard, query: string): boolean => {
        return card.title.toLowerCase().includes(query) ||
            card.description?.toLowerCase().includes(query) ||
            card.assignee?.toLowerCase().includes(query) ||
            false;
    }, []);

    return (
        <KanbanBoard<TasksByDeadline>
            lazyPropName="tasksByDeadline"
            columns={[
                { id: 'overdue', title: 'Scaduti' },
                { id: 'today', title: 'Scadono Oggi' },
                { id: 'week', title: 'Scadono nella Settimana' },
                { id: 'month', title: 'Scadono nel Mese' }
            ]}
            dataMapper={dataMapper}
            calculateNewDate={calculateNewDate}
            onCardMoved={handleCardMoved}
            filterFn={filterCards}
            searchPlaceholder="Cerca task per titolo, descrizione o assegnatario..."
        />
    );
}
