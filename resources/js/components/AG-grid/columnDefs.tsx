const TaskColumnDefs = [
    { field: 'ID' },
    { field: 'Titolo' },
    { field: 'Cliente' },
    { field: 'Contatto' },
    { field: 'Data Inizio' },
    { field: 'Data Fine' },
    { field: 'Ora Inizio' },
    { field: 'Ora Fine' },
    { field: 'Descrizione' },
    { field: 'Stato' },
    { field: 'Priorità' },
    { field: 'Tipo Task' },
    { field: 'Assegnato Da' },
    { field: 'Assegnato A' },
    { field: 'Osservatore' },
    { field: 'Gruppo' },
    { field: 'Tutto il Giorno' },
    { field: 'Area' },
    { field: 'Area Interesse' },
    { field: 'Opportunità' },
    { field: 'Lead' },
    { field: 'Ordine' },
    { field: 'Milestone Ordine' },
    { field: 'Attività' },
    { field: 'Spazio' },
    { field: 'Sito' },
    { field: 'Posizione' },
    { field: 'Ubicazione' },
    { field: 'Ore Stimate' },
    { field: 'Minuti Stimati' },
    { field: 'Percentuale Completamento' },
    { field: 'Task Padre' },
    { field: 'Aperto' },
    { field: 'Esito' },
    { field: 'Feedback' },
    { field: 'Feedback Richiesto' },
    { field: 'Contestata' },
    { field: 'Stato Consulenza' },
    { field: 'Tipo Servizio' },
    { field: 'Descrizione Operazione' },
    { field: 'Note Operazione' },
    { field: 'Video Operazione' },
    { field: 'Chiave Unica' },
    { field: 'Data Creazione' },
    { field: 'Data Aggiornamento' },
];

export function getColumnDefs(entity: string) {
    switch (entity) {
        case 'tasks':
            return TaskColumnDefs;
        default:
            return [];
    }
}