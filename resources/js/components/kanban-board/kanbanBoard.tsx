import { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { Column } from "./column";
import { Board, KanbanColumn, KanbanCard } from "./boardData";
import { router, usePage } from '@inertiajs/react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "./card";

interface KanbanBoardProps<TData = any> {
  /** Nome della prop Inertia da caricare (lazy prop) */
  lazyPropName: string;
  /** Definizione delle colonne */
  columns: Array<{
    id: string;
    title: string;
  }>;
  /** Funzione per mappare i dati della prop in KanbanCard[] per ogni colonna */
  dataMapper: (data: TData) => Record<string, KanbanCard[]>;
  /** Funzione per calcolare la nuova data quando si sposta una card */
  calculateNewDate?: (columnId: string) => string;
  /** Callback quando una card viene spostata */
  onCardMoved?: (cardId: string, fromColumn: string, toColumn: string, newDate: string) => void;
  /** Funzione per filtrare le card (riceve la card e la query di ricerca) */
  filterFn?: (card: KanbanCard, query: string) => boolean;
  /** Placeholder per l'input di ricerca */
  searchPlaceholder?: string;
}

export function KanbanBoard<TData = any>({
  lazyPropName,
  columns: columnDefinitions,
  dataMapper,
  calculateNewDate,
  onCardMoved,
  filterFn,
  searchPlaceholder = 'Cerca...'
}: KanbanBoardProps<TData>) {
  const [board, setBoard] = useState<Board>({
    columns: columnDefinitions.map(col => ({ ...col, cards: [] }))
  });
  const [filteredBoard, setFilteredBoard] = useState<Board>({
    columns: columnDefinitions.map(col => ({ ...col, cards: [] }))
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { props } = usePage<Record<string, any>>();

  const data = props[lazyPropName] as TData | undefined;

  useEffect(() => {
    if (!data) {
      setIsLoading(true);
      setError(null);

      router.reload({
        only: [lazyPropName],
        data: {
          year: '2025',
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (errors) => {
          setIsLoading(false);
          setError('Errore nel caricamento dei dati');
          console.error('Error loading data:', errors);
        },
        onFinish: () => {
          setIsLoading(false);
        }
      });
    }
  }, [data, lazyPropName]);

  // Popola le colonne quando arrivano i dati
  useEffect(() => {
    if (data) {
      const mappedData = dataMapper(data);

      const newBoard: Board = {
        columns: columnDefinitions.map(colDef => ({
          id: colDef.id,
          title: colDef.title,
          cards: mappedData[colDef.id] || []
        }))
      };

      setBoard(newBoard);
      setFilteredBoard(newBoard);
    }
  }, [data, dataMapper, columnDefinitions]);

  // Filtra le card in base alla ricerca
  useEffect(() => {
    // Non filtrare durante il drag per evitare freeze
    if (activeId) return;

    if (!searchQuery.trim()) {
      setFilteredBoard(board);
      return;
    }

    if (!filterFn) {
      setFilteredBoard(board);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Board = {
      columns: board.columns.map(col => ({
        ...col,
        cards: col.cards.filter(card => filterFn(card, query))
      }))
    };

    setFilteredBoard(filtered);
  }, [searchQuery, board, filterFn, activeId]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string;
    setActiveId(activeId);

    // Trova e salva la colonna di origine
    const sourceColumn = board.columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );
    setSourceColumnId(sourceColumn?.id || null);
  }

  function getNewDate(columnId: string): string {
    if (calculateNewDate) {
      return calculateNewDate(columnId);
    }
    // Default: data odierna
    return new Date().toISOString().split('T')[0];
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setTargetColumnId(null);
      return;
    }

    const overId = over.id as string;

    // Trova la colonna di destinazione
    let overColumn = filteredBoard.columns.find((col) => col.id === overId);

    if (!overColumn) {
      overColumn = filteredBoard.columns.find((col) =>
        col.cards.some((card) => card.id === overId)
      );
    }

    if (overColumn) {
      setTargetColumnId(overColumn.id);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event;

    if (active && sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      const activeId = active.id as string;

      const activeColumn = filteredBoard.columns.find((col) =>
        col.cards.some((card) => card.id === activeId)
      );
      const overColumn = filteredBoard.columns.find((col) => col.id === targetColumnId);

      if (activeColumn && overColumn) {
        const newDueDate = getNewDate(overColumn.id);
        const activeIndex = activeColumn.cards.findIndex((card) => card.id === activeId);
        const movedCard = { ...activeColumn.cards[activeIndex], dueDate: newDueDate };

        const newSourceCards = activeColumn.cards.filter((card) => card.id !== activeId);
        const newTargetCards = [...overColumn.cards, movedCard];

        // Ordina le card della colonna di destinazione per data decrescente
        newTargetCards.sort((a, b) => {
          if (!a.dueDate || !b.dueDate) return 0;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });

        const newColumns = filteredBoard.columns.map((col) => {
          if (col.id === activeColumn.id) return { ...col, cards: newSourceCards };
          if (col.id === overColumn.id) return { ...col, cards: newTargetCards };
          return col;
        });

        const newBoard = { columns: newColumns };
        setBoard(newBoard);
        setFilteredBoard(newBoard);

        if (onCardMoved) {
          onCardMoved(
            activeId,
            sourceColumnId,
            targetColumnId,
            newDueDate
          );
        }
      }
    }

    setActiveId(null);
    setSourceColumnId(null);
    setTargetColumnId(null);
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription className="flex items-center justify-between">
          <span>⚠️ {error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.reload({ only: [lazyPropName] })}
          >
            Riprova
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 overflow-x-hidden">
      <div className="px-2 sm:px-4 pt-2 sm:pt-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Desktop: horizontal scroll | Mobile: vertical stack */}
        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4 bg-background relative md:overflow-x-auto">
          {filteredBoard.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            (() => {
              const activeCard = filteredBoard.columns
                .flatMap(col => col.cards)
                .find(card => card.id === activeId);
              return activeCard ? <Card card={activeCard} /> : null;
            })()
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

