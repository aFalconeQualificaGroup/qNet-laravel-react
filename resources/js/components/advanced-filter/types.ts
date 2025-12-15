// --- Types ---
export type LogicType = 'AND' | 'OR';

export interface Condition {
    id: string;
    operator: string;
    values: string[];
    logic: LogicType | null;
}

export interface FilterState {
    conditions: Condition[];
}

export interface FiltersMap {
    [key: string]: FilterState;
}

export interface CollegatoAState {
    tipo: 'Azienda' | 'Contatto' | 'Nessuno' | '';
    azienda: string;
    contatto: string;
    sottoTipo: 'Nessuno' | 'Commessa' | 'Opportunità';
    commessa: string;
    opportunita: string;
}

export interface SavedFilter {
    id: number;
    name: string;
    description: string;
    filters: FiltersMap;
    collegatoA: CollegatoAState;
    searchText: string;
    createdAt: string;
}

// --- Mock Data ---
export const MOCK_DATA = {
    tipoCollegamento: ['Azienda', 'Contatto', 'Nessuno'] as const,
    aziende: ['QUALIFICA GROUP S.r.l.', 'Azienda ABC', 'Studio Legale XYZ'],
    contatti: ['Mario Rossi', 'Giulia Bianchi', 'Luca Verdi'],
    sottoCollegamento: ['Nessuno', 'Commessa', 'Opportunità'] as const,
    commesse: ['ISO 9001:2015', 'Sviluppo Software', 'Consulenza Privacy'],
    opportunita: ['Lead Generation 2024', 'Espansione Mercato', 'Partnership Strategica'],
    stati: ['Aperto', 'In Progress', 'Completato', 'Chiuso'],
    priorita: ['Bassa', 'Media', 'Alta', 'Urgente'],
    utenti: ['Mario Rossi', 'Giulia Bianchi', 'Luca Verdi', 'Anna Neri', 'Paolo Blu'],
    tipiAttivita: ['Task', 'Meeting', 'Call', 'Email', 'Review'],
    statoCompletamento: ['Non iniziato', 'In corso', 'Completato', 'Bloccato']
};

// --- Operators ---
export const OPERATORS = {
    select: [
        { value: 'equals', label: 'Uguale a' },
        { value: 'not_equals', label: 'Diverso da' },
        { value: 'is_empty', label: 'È vuoto' },
        { value: 'is_not_empty', label: 'Non è vuoto' }
    ],
    multiselect: [
        { value: 'in', label: 'Contiene uno di' },
        { value: 'not_in', label: 'Non contiene' },
        { value: 'is_empty', label: 'È vuoto' },
        { value: 'is_not_empty', label: 'Non è vuoto' }
    ],
    date: [
        { value: 'equals', label: 'In data' },
        { value: 'before', label: 'Prima del' },
        { value: 'after', label: 'Dopo il' },
        { value: 'between', label: 'Tra le date' },
        { value: 'is_empty', label: 'È vuoto' },
        { value: 'is_not_empty', label: 'Non è vuoto' }
    ]
};
