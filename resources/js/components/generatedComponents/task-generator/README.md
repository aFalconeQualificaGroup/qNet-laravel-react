# Task Generator Components

Componenti modulari per la creazione di task, seguendo le best practice di React.

## Struttura

```
task-generator/
├── index.ts                    # Export principale di tutti i componenti
├── types.ts                    # Tipi TypeScript condivisi
├── constants.ts                # Costanti (task types, priorità, etc.)
├── utils.ts                    # Funzioni utility
├── task-generator.css          # Stili CSS
│
├── add-task-form.tsx           # Componente principale del form
├── calendar-compact.tsx        # Calendario con selezione data/ora
├── user-dropdown.tsx           # Dropdown multi-select per utenti
├── priority-selector.tsx       # Selettore priorità
├── task-type-button.tsx        # Bottone tipo task
└── task-preview.tsx            # Preview componenti task selezionati
```

## Componenti

### AddTaskForm
Componente principale che orchestra tutti i sottocomponenti per creare un task.

**Props:**
- `onSubmit`: Callback per la sottomissione del form
- `onReset`: Callback per il reset del form
- `form`: Stato del form (TaskForm)
- `handleFormDataChange`: Handler per modifiche ai campi
- `repeatConfig`: Configurazione ripetizione task
- `onChangeConfig`: Handler per modifiche alla configurazione ripetizione
- `users`, `clients`, `commesse_client`, `opportunitys_client`, `contacts_client`: Dati dal backend

### CalendarCompact
Calendario compatto con selezione rapida di date comuni e selezione orario.

**Props:**
- `value`: Data in formato ISO string
- `onChange`: Callback quando la data cambia
- `label`: Label del bottone (default: "Data")

**Features:**
- Selezione rapida (oggi, domani, settimana, etc.)
- Selezione mese/anno
- Selezione orario con quick slots
- Reset automatico quando value è null

### UserDropdown
Dropdown multi-select per la selezione di utenti (assegnatari, osservatori, contatti).

**Props:**
- `users`: Array di utenti
- `value`: Array di ID selezionati
- `onChange`: Callback quando la selezione cambia
- `title`: Titolo del dropdown
- `showRoleCompany`: Mostra ruolo e azienda (default: true)
- `setFilter`: Callback per filtrare utenti (ricerca)
- `icon`: Icona da mostrare nel bottone

**Features:**
- Ricerca testuale
- Avatar con iniziali
- Visualizzazione ruolo/azienda
- Indicatore selezione

### PrioritySelector
Popover per la selezione della priorità del task.

**Props:**
- `value`: Priorità corrente
- `onChange`: Callback quando la priorità cambia
- `open`: Stato apertura popover
- `onOpenChange`: Callback per gestire apertura/chiusura

### TaskTypeButton
Bottone per cambiare ciclicamente il tipo di task (Telefonata, Appuntamento, To-Do).

**Props:**
- `value`: Tipo task corrente
- `onToggle`: Callback per cambiare tipo

### TaskPreview
Componente che mostra un'anteprima dei componenti selezionati del task.

**Props:**
- `form`: Stato del form
- `users`: Array di utenti (per nomi assegnatari/osservatori)
- `showStartDate`: Se mostrare la data inizio
- `onToggleStartDate`: Callback per mostrare/nascondere data inizio
- `onTaskTypeClick`: Callback per click sul tipo task
- `onPriorityClick`: Callback per click sulla priorità

**Features:**
- Preview interattiva
- Link per modificare i componenti
- Bottone per aggiungere data inizio

### SubtaskManager
Componente per gestire le sottoattività di un task principale.

**Props:**
- `subtasks`: Array di sottoattività esistenti
- `onChange`: Callback quando le sottoattività cambiano
- `users`: Array di utenti (per assegnatari/osservatori)

**Features:**
- Aggiunta/modifica/eliminazione sottoattività
- Ogni sottoattività ha: titolo, descrizione, tipo, priorità, assegnatari, osservatori, date
- Checkbox per marcare come completata
- Form inline per aggiunta rapida
- Visualizzazione compatta delle sottoattività esistenti
- Edit inline con form espanso

**Nota:** Le sottoattività NON supportano:
- Ripetizione task
- Note aggiuntive
- Documenti allegati
- Collegamento a clienti/commesse

## Utilizzo

```tsx
import { AddTaskForm } from '@/components/generatedComponents/task-generator';

function MyPage() {
  return (
    <AddTaskForm
      form={form}
      handleFormDataChange={handleChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      repeatConfig={repeatConfig}
      onChangeConfig={handleConfigChange}
      users={users}
      clients={clients}
      // ... altri props
    />
  );
}
```

## Costanti

### TASK_TYPES
Array di tipi task disponibili:
- `call`: Telefonata (📞)
- `meeting`: Appuntamento (🤝)
- `to do`: To-Do (✔️)

### PRIORITIES
Array di priorità disponibili:
- `low`: Bassa (🟢)
- `normal`: Normale (🔵)
- `high`: Alta (🟠)
- `urgent`: Urgente (🔴)

### QUICK_DATE_OPTIONS
Opzioni per selezione rapida date nel calendario.

### FILTER_STATUS_OPTIONS
Opzioni per filtrare commesse/opportunità per stato.

## Funzioni Utility

### `fmtDateHuman(date: Date | null): string`
Formatta una data in formato italiano leggibile.

### `formatDateParts(date: string | null): { dateStr: string; timeStr?: string }`
Estrae le parti data e ora da una stringa ISO.

### `calculateQuickDate(type: string): { date: Date; time: string }`
Calcola la data per le selezioni rapide.

### `getUserInitials(name?: string, lastName?: string): string`
Genera le iniziali da nome e cognome.

### `getUserFullName(name?: string, lastName?: string): string`
Genera il nome completo formattato.

## Note
- Il CSS è centralizzato in `task-generator.css`
