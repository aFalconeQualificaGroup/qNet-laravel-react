import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card as ShadCard } from "@/components/ui/card";
import { Calendar, User, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { KanbanCard } from "./boardData";
import { useState } from "react";

interface Props {
  card: KanbanCard;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';

  // Converti vari formati in Date
  let date: Date;

  // Prova formato DD-MM-YYYY
  if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
    const [day, month, year] = dateString.split('-');
    date = new Date(`${year}-${month}-${day}`);
  } else {
    // Formato ISO YYYY-MM-DD o altri
    date = new Date(dateString);
  }

  // Verifica se la data è valida
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowDay = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  if (dateDay.getTime() === todayDay.getTime()) return 'Oggi';
  if (dateDay.getTime() === tomorrowDay.getTime()) return 'Domani';

  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Card({ card }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <>
      <ShadCard
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="p-2 sm:p-3 bg-card dark:bg-card border border-border shadow-sm cursor-grab active:cursor-grabbing select-none hover:shadow-md active:scale-95 mb-2 relative group transition-transform duration-150"
        style={style}
      >
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          <div className="text-card-foreground font-medium text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 flex-1">{card.title}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>

        {card.description && (
          <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 line-clamp-2">
            {card.description}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-border gap-1 sm:gap-2">
          {card.dueDate && (
            <div className="flex items-center gap-1 min-w-0">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">{formatDate(card.dueDate)}</span>
            </div>
          )}

          {card.assignee && (
            <div className="flex items-center gap-1 min-w-0">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{card.assignee}</span>
            </div>
          )}
        </div>
      </ShadCard>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{card.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            {card.description && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Descrizione</h4>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">{card.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {card.dueDate && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-1">Scadenza</h4>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatDate(card.dueDate)} ({card.dueDate})</span>
                  </div>
                </div>
              )}

              {card.assignee && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-1">Assegnato a</h4>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{card.assignee}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
