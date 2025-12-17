// Tipo per un singolo task dal backend
export type OriginalTaskType = {
    all_day: any;
    area_id: number | null;
    area_interesse: any;
    assigned_by: number | null;
    assigned_to: number | null;
    contact_id: number | null;
    contestata: any;
    created_at: string;
    customer_id: number | null;
    datatask: string | null;
    datataskend: string | null;
    description: string | null;
    endtask: string | null;
    esito: any;
    feedback: any;
    feedback_required: any;
    group_id: number | null;
    hours_estimed: number | null;
    id: number;
    id_attivita: number | null;
    id_spazio: number | null;
    lead_id: number | null;
    location: string | null;
    minutes_estimed: number | null;
    observer: any;
    open: number;
    operation_description: string | null;
    operation_note: string | null;
    operation_video: any;
    opportunity_id: number | null;
    order_id: number | null;
    ordermilestone_id: number | null;
    parent_id: number;
    perc_completamento: number;
    position: any;
    priority: any;
    site_id: number | null;
    stato_consulenza: any;
    status: number;
    timetask: string | null;
    timetaskend: string | null;
    title: string;
    typeservice: any;
    typetask: string;
    unique_key: string | null;
    updated_at: string;
    // Relazioni
    customer?: { id: number; name: string } | null;
    order?: { id: number; title: string } | null;
    order_milestone?: { id: number; title: string } | null;
    opportunity?: { id: number; title: string } | null;
    lead?: { id: number; name: string } | null;
    contact?: { id: number; name: string } | null;
    assigned_by_user?: { id: number; name: string; last_name: string } | null;
    assigned_to_user?: { id: number; name: string; last_name: string } | null;
    area?: { id: number; nome: string } | null;
    site?: { id: number; address: string } | null;
    spazio_attivita?: { id: number; nome: string } | null;
    spazio?: { id: number; nome: string } | null;
    osservatore?: { id: number; name: string; last_name: string } | null;
};

// Tipo per l'array di task dal backend (era definito male prima)
type TaskDataParsingType = OriginalTaskType[];

function TaskDataParsing(data: any[]) {

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    return data.map(task => ({
        ID: task.id,
        Titolo: task.title,
        Cliente: task.customer?.name || '-',
        Contatto: task.contact?.name || '-',
        "Data Inizio": task.datatask,
        "Data Fine": task.datataskend,
        "Ora Inizio": task.timetask,
        "Ora Fine": task.timetaskend,
        Descrizione: task.description,
        Stato: task.status,
        Priorità: task.priority,
        "Tipo Task": task.typetask,
        "Assegnato Da": task.assigned_by_user ? `${task.assigned_by_user.name} ${task.assigned_by_user.last_name}` : '-',
        "Assegnato A": task.assigned_to_user ? `${task.assigned_to_user.name} ${task.assigned_to_user.last_name}` : '-',
        Osservatore: task.osservatore ? `${task.osservatore.name} ${task.osservatore.last_name}` : '-',
        Gruppo: task.group_id,
        "Tutto il Giorno": task.all_day,
        Area: task.area?.nome || '-',
        "Area Interesse": task.area_interesse,
        Opportunità: task.opportunity?.title || '-',
        Lead: task.lead?.name || '-',
        Ordine: task.order?.title || '-',
        "Milestone Ordine": task.order_milestone?.title || '-',
        Attività: task.spazio_attivita?.nome || '-',
        Spazio: task.spazio?.nome || '-',
        Sito: task.site?.address || '-',
        Posizione: task.position,
        Ubicazione: task.location,
        "Ore Stimate": task.hours_estimed,
        "Minuti Stimati": task.minutes_estimed,
        "Percentuale Completamento": task.perc_completamento,
        "Task Padre": task.parent_id,
        Aperto: task.open,
        Esito: task.esito,
        Feedback: task.feedback,
        "Feedback Richiesto": task.feedback_required,
        Contestata: task.contestata,
        "Stato Consulenza": task.stato_consulenza,
        "Tipo Servizio": task.typeservice,
        "Descrizione Operazione": task.operation_description,
        "Note Operazione": task.operation_note,
        "Video Operazione": task.operation_video,
        "Chiave Unica": task.unique_key,
        "Data Creazione": formatDate(task.created_at),
        "Data Aggiornamento": formatDate(task.updated_at),
    }));
}

export default TaskDataParsing;
export type { TaskDataParsingType };
