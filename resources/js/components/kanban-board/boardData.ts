export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // Data di scadenza in formato ISO
  assignee?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface Board {
  columns: KanbanColumn[];
}

/**
 * Funzione helper per calcolare le date di scadenza
 */
export function getDeadlineDates() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Fine settimana (domenica)
  const endOfWeek = new Date(today);
  const dayOfWeek = endOfWeek.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
  
  // Fine mese
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    today,
    endOfWeek,
    endOfMonth,
  };
}

/**
 * Determina in quale colonna deve stare un task in base alla sua data di scadenza
 */
export function getColumnForDueDate(dueDate: string | null | undefined): KanbanColumn['id'] {
  if (!dueDate) return 'month'; // Default se non ha data
  
  const due = new Date(dueDate);
  const { today, endOfWeek, endOfMonth } = getDeadlineDates();
  
  // Normalizza le date per confronto (solo giorno, senza ora)
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  // Scaduto
  if (dueDay < today) {
    return 'overdue';
  }
  
  // Scade oggi
  if (dueDay.getTime() === today.getTime()) {
    return 'today';
  }
  
  // Scade nella settimana
  if (dueDay <= endOfWeek) {
    return 'week';
  }
  
  // Scade nel mese
  if (dueDay <= endOfMonth) {
    return 'month';
  }
  
  // Oltre il mese
  return 'month';
}

export const initialBoardTasks: Board = {
  columns: [
    {
      id: "overdue",
      title: "Scaduti",
      cards: []
    },
    {
      id: "today",
      title: "Scadono Oggi",
      cards: []
    },
    {
      id: "week",
      title: "Scadono nella Settimana",
      cards: []
    },
    {
      id: "month",
      title: "Scadono nel Mese",
      cards: []
    }
  ]
};

export const InertiaRouterClousure = {
  KanbanTasksByDeadLine: 'tasksByDeadline'
}
