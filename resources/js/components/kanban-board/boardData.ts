export interface KanbanCard {
  id: string;
  title: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface Board {
  columns: KanbanColumn[];
}

export const initialBoard: Board = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "task-1", title: "Scrivere documentazione" },
        { id: "task-2", title: "Preparare meeting" }
      ]
    },
    {
      id: "inprogress",
      title: "In Progress",
      cards: [{ id: "task-3", title: "Implementare API" }]
    },
    {
      id: "done",
      title: "Done",
      cards: [{ id: "task-4", title: "Fixare bug UI" }]
    }
  ]
};
