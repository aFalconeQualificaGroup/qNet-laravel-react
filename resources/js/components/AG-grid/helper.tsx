type TaskDataParsingType = {
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
}[];

function TaskDataParsing(data: TaskDataParsingType[]) {
    return data.map(task => ({
        ID: task.id,
        Titolo: task.title,
        Cliente: task.customer_id,
        Contatto: task.contact_id,
        "Data Inizio": task.datatask,
        "Data Fine": task.datataskend,
        "Ora Inizio": task.timetask,
        "Ora Fine": task.timetaskend,
        Descrizione: task.description,
        Stato: task.status,
        Priorità: task.priority,
        "Tipo Task": task.typetask,
        "Assegnato Da": task.assigned_by,
        "Assegnato A": task.assigned_to,
        Osservatore: task.observer,
        Gruppo: task.group_id,
        "Tutto il Giorno": task.all_day,
        Area: task.area_id,
        "Area Interesse": task.area_interesse,
        Opportunità: task.opportunity_id,
        Lead: task.lead_id,
        Ordine: task.order_id,
        "Milestone Ordine": task.ordermilestone_id,
        Attività: task.id_attivita,
        Spazio: task.id_spazio,
        Sito: task.site_id,
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
        "Data Creazione": task.created_at,
        "Data Aggiornamento": task.updated_at,
    }));
}

export default TaskDataParsing;
export type { TaskDataParsingType };
