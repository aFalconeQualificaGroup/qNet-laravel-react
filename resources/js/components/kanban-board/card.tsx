import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as ShadCard } from "@/components/ui/card";
import type { KanbanCard } from "./boardData";

interface Props {
  card: KanbanCard;
}

/**
 * Componente Card della Kanban Board
 * Rappresenta una singola card draggabile all'interno di una colonna
 */
export function Card({ card }: Props) {
  /**
   * useSortable: rende questa card draggabile e sortable
   * Restituisce:
   * - attributes: attributi accessibility per il drag
   * - listeners: event handlers per mouse/touch
   * - setNodeRef: riferimento al nodo DOM
   * - transform: trasformazione CSS durante il drag
   * - transition: animazione CSS (disabilitata durante il drag per evitare effetto elastico)
   * - isDragging: boolean che indica se questa card è attualmente in drag
   */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  /**
   * Stile dinamico per il drag and drop
   * - transform: applica la trasformazione di posizione durante il drag
   * - transition: DISABILITATO durante il drag per evitare effetto elastico
   *   (viene riattivato automaticamente quando il drag finisce)
   * - opacity: ridotta a 0.5 durante il drag per feedback visivo
   */
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition, // ⚡ FIX effetto elastico
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ShadCard
      ref={setNodeRef}        // Riferimento per dnd-kit
      {...attributes}         // Attributi accessibility (aria-*, role, etc)
      {...listeners}          // Event handlers per drag (onPointerDown, etc)
      className="p-3 bg-card dark:bg-card border border-border shadow-sm cursor-grab active:cursor-grabbing select-none hover:shadow-md"
      style={style}           // Stili dinamici per drag
    >
      {/* Contenuto della card */}
      <div className="text-card-foreground">{card.title}</div>
      
      {/* 🔔 HOOK: Qui puoi aggiungere contenuto personalizzato alla card */}
      {/* Esempi:
        - Badge per priorità/status
        - Avatar dell'assegnatario
        - Data di scadenza
        - Tag/etichette
        - Pulsanti azione (edit, delete)
        - Contatore commenti/allegati
      */}
    </ShadCard>
  );
}
