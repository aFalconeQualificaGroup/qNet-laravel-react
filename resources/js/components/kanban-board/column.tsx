import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "./card";
import type { KanbanColumn } from "./boardData";

interface Props {
  column: KanbanColumn;
}

/**
 * Componente Colonna della Kanban Board
 * Rappresenta una colonna (es. "To Do", "In Progress", "Done")
 * È una drop zone che può ricevere card draggabili
 */
export function Column({ column }: Props) {
  /**
   * useDroppable: rende questa colonna un target valido per il drop
   * Permette di droppare card anche quando la colonna è vuota
   */
  const { setNodeRef } = useDroppable({
    id: column.id, // ID univoco della colonna
  });

  return (
    <div
      ref={setNodeRef} // Riferimento per renderla droppable
      className="w-80 bg-muted/30 dark:bg-muted/10 border border-border p-4 rounded-md min-h-[500px]"
    >
      {/* Titolo della colonna */}
      <h2 className="text-lg font-bold mb-4 text-foreground">{column.title}</h2>

      {/**
       * SortableContext: definisce il contesto per le card draggabili
       * - items: lista degli ID delle card in questa colonna
       * - strategy: verticalListSortingStrategy per ordinamento verticale
       * 
       * ⚡ IMPORTANTE: Deve essere DENTRO la colonna per funzionare correttamente
       */}
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* Container delle card con spacing verticale */}
        <div className="space-y-2">
          {column.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
