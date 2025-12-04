import { useDroppable } from "@dnd-kit/core";
import { Card } from "./card";
import type { KanbanColumn } from "./boardData";

interface Props {
  column: KanbanColumn;
}

export function Column({ column }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className="flex-1 bg-muted/30 dark:bg-muted/10 border border-border rounded-md flex flex-col min-w-[280px]"
      style={{
        height: '600px'
      }}
    >
      <div 
        ref={setNodeRef}
        className="flex-1 flex flex-col overflow-hidden p-4"
        style={{
          backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
          transition: 'background-color 0.2s'
        }}
      >
        <h2 className="text-lg font-bold mb-4 text-foreground shrink-0">{column.title}</h2>
        
        <div className="flex-1 overflow-hidden overflow-y-scroll space-y-2 pr-2">
          {column.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
