import { useState } from "react";
import { 
  DndContext, 
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { Column } from "./column";
import { initialBoard, Board, KanbanColumn } from "./boardData";

/**
 * Componente principale della Kanban Board
 * Gestisce il drag and drop delle card tra le colonne
 */
export function KanbanBoard() {
  // Stato del board con tutte le colonne e le relative card
  const [board, setBoard] = useState<Board>(initialBoard);
  
  // ID della card attualmente in drag (null quando non c'è drag attivo)
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * Configurazione dei sensori per il drag and drop
   * PointerSensor: richiede uno spostamento di 8px prima di attivare il drag
   * Questo previene drag accidentali durante i click
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // distanza minima in pixel per attivare il drag
      },
    })
  );

  /**
   * Gestisce l'inizio del drag
   * Salva l'ID della card che viene trascinata
   */
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  /**
   * Gestisce il movimento della card DURANTE il drag (in tempo reale)
   * Questa funzione viene chiamata continuamente mentre la card viene trascinata
   * Si occupa di spostare le card tra colonne diverse
   */
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    // Se non c'è un target valido, esci
    if (!over) return;

    const activeId = active.id as string; // ID della card che viene trascinata
    const overId = over.id as string;     // ID della card/colonna su cui stiamo passando

    // Se stiamo passando sopra noi stessi, non fare nulla
    if (activeId === overId) return;

    // 1️⃣ TROVA LA COLONNA SORGENTE (da dove viene la card)
    const activeColumn = board.columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );
    
    // 2️⃣ TROVA LA COLONNA DESTINAZIONE (dove stiamo trascinando)
    // Prima prova a trovare la colonna che contiene la card su cui stiamo passando
    let overColumn = board.columns.find((col) =>
      col.cards.some((card) => card.id === overId)
    );

    // Se over è direttamente una colonna (drag su colonna vuota), usa quella
    if (!overColumn) {
      overColumn = board.columns.find((col) => col.id === overId);
    }

    // Se non troviamo entrambe le colonne, esci
    if (!activeColumn || !overColumn) return;

    // 3️⃣ GESTISCI LO SPOSTAMENTO TRA COLONNE DIVERSE
    if (activeColumn.id !== overColumn.id) {
      // 🔔 HOOK: Qui puoi aggiungere logica quando una card viene spostata tra colonne
      // Esempio: validazione se lo spostamento è permesso (es. stato workflow)
      // Esempio: notifiche in tempo reale agli altri utenti
      // Esempio: log/analytics per tracciare i movimenti
      // Esempio: preview API call (debounced) per validare lo spostamento
      
      const fromStateId = activeColumn.id;
      const toStateId = overColumn.id;
      const cardId = activeId;

      // Aggiornare lato backend lo state della card da fromStateId a toStateId


      // Trova la posizione della card nella colonna sorgente
      const activeIndex = activeColumn.cards.findIndex(
        (card) => card.id === activeId
      );
      
      // Trova la posizione dove inserire nella colonna destinazione
      const overIndex = overColumn.cards.findIndex(
        (card) => card.id === overId
      );

      // Ottieni la card che viene spostata
      const movedCard = activeColumn.cards[activeIndex];

      // 4️⃣ AGGIORNA LO STATO: rimuovi dalla sorgente, aggiungi alla destinazione
      
      // Rimuovi la card dalla colonna sorgente
      const newSourceCards = activeColumn.cards.filter(
        (card) => card.id !== activeId
      );

      // Aggiungi la card alla colonna destinazione nella posizione corretta
      const newTargetCards = [...overColumn.cards];
      const insertIndex = overIndex >= 0 ? overIndex : newTargetCards.length;
      newTargetCards.splice(insertIndex, 0, movedCard);

      // Crea il nuovo stato del board
      const newColumns = board.columns.map((col) => {
        if (col.id === activeColumn.id) return { ...col, cards: newSourceCards };
        if (col.id === overColumn.id) return { ...col, cards: newTargetCards };
        return col;
      });

      // Aggiorna lo stato
      setBoard({ columns: newColumns });

    }
  }

  /**
   * Gestisce la FINE del drag (quando l'utente rilascia il mouse)
   * Si occupa di:
   * 1. Riordinare le card NELLA STESSA colonna
   * 2. Finalizzare lo spostamento tra colonne (già gestito da handleDragOver)
   */
  function handleDragEnd(event: DragEndEvent) {
    // Reset dell'ID attivo
    setActiveId(null);
    
    const { active, over } = event;
    
    // Se non c'è un target valido o stiamo rilasciando sulla stessa card
    if (!over || active.id === over.id) return;

    const activeId = active.id as string; // Card che abbiamo trascinato
    const overId = over.id as string;     // Card/colonna su cui abbiamo rilasciato

    // Trova la colonna che contiene la card trascinata
    const activeColumn = board.columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!activeColumn) return;

    // Trova le posizioni delle card nella colonna
    const activeIndex = activeColumn.cards.findIndex(
      (card) => card.id === activeId
    );
    const overIndex = activeColumn.cards.findIndex(
      (card) => card.id === overId
    );

    // 1️⃣ CASO: Riordinamento NELLA STESSA colonna
    if (activeIndex !== -1 && overIndex !== -1) {
      // 🔔 HOOK: Qui puoi aggiungere logica quando una card viene riordinata nella stessa colonna
      // Esempio: salvare il nuovo ordine/priorità sul backend
      // Esempio: aggiornare un campo "position" o "order_index"
      // Esempio: await updateCardPosition(activeId, overIndex)
      
      // Usa arrayMove per riordinare in modo ottimizzato
      const newCards = arrayMove(activeColumn.cards, activeIndex, overIndex);

      // Aggiorna solo la colonna interessata
      const newColumns = board.columns.map((col) =>
        col.id === activeColumn.id ? { ...col, cards: newCards } : col
      );

      setBoard({ columns: newColumns });
      
    } else {
      // 2️⃣ CASO: Fine dello spostamento TRA COLONNE
      // Lo spostamento è già stato gestito da handleDragOver in tempo reale
      // Qui possiamo finalizzare con chiamate API, notifiche, ecc.
      
      // 🔔 HOOK: Qui puoi aggiungere logica quando il drag termina dopo uno spostamento tra colonne
      // Esempio: confermare/persistere lo spostamento con il backend
      // Esempio: inviare notifiche push agli utenti coinvolti
      // Esempio: aggiornare campi come timestamp, status, assegnatari
      // Esempio: trigger di automazioni (es. quando passa a "Completato")
      // Esempio: validazione finale dello spostamento
      // 
      // ⚡ Dati disponibili:
      // - activeColumn: colonna da cui proviene la card
      // - activeId: ID della card spostata
      // 
      // 📍 Per trovare la colonna di destinazione:
      const targetColumn = board.columns.find((col) =>
        col.cards.some((card) => card.id === activeId)
      );
      
      // 💡 Esempio di implementazione:
      // if (targetColumn) {
      //   console.log('Card moved from', activeColumn.id, 'to', targetColumn.id);
      //   await updateCardStatus(activeId, {
      //     old_status: activeColumn.id,
      //     new_status: targetColumn.id,
      //     moved_at: new Date().toISOString()
      //   });
      // }
    }
  }

  return (
    <DndContext
      sensors={sensors}                    // Configurazione sensori (PointerSensor con 8px threshold)
      collisionDetection={closestCorners}  // Algoritmo per rilevare collision (migliore per multi-colonna)
      onDragStart={handleDragStart}        // Chiamato quando inizia il drag
      onDragOver={handleDragOver}          // Chiamato DURANTE il drag (movimento tra colonne)
      onDragEnd={handleDragEnd}            // Chiamato quando finisce il drag (riordinamento)
    >
      {/* Container principale del Kanban con scroll orizzontale */}
      <div className="flex gap-4 overflow-x-auto p-4 bg-background">
        {board.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DndContext>
  );
}

