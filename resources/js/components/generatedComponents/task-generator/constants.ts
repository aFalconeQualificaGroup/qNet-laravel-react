// Constants for Task Generator

export const TASK_TYPES = [
    { id: "call", icon: "📞", label: "Telefonata" },
    { id: "meeting", icon: "🤝", label: "Appuntamento" },
    { id: "todo", icon: "✔️", label: "To-Do" },
] as const;

export const PRIORITIES = [
    { id: "low", label: "Bassa", icon: "🟢" },
    { id: "normal", label: "Normale", icon: "🔵" },
    { id: "high", label: "Alta", icon: "🟠" },
    { id: "urgent", label: "Urgente", icon: "🔴" },
] as const;

export const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export const QUICK_DATE_OPTIONS = [
    { id: "oggi", label: "Oggi", icon: "📌" },
    { id: "domani", label: "Domani", icon: "⏰" },
    { id: "dopodomani", label: "Dopodomani", icon: "📆" },
    { id: "settimana", label: "+1 settimana", icon: "📊" },
    { id: "dueset", label: "+2 settimane", icon: "📈" },
    { id: "mese", label: "+1 mese", icon: "🗓️" },
    { id: "lunedi", label: "Lunedì prossimo", icon: "🔵" },
    { id: "venerdi", label: "Venerdì prossimo", icon: "🎉" },
    { id: "fine_mese", label: "Fine mese", icon: "📝" },
] as const;

export const FILTER_STATUS_OPTIONS = [
    { value: "in_lavorazione", label: "In lavorazione" },
    { value: "chiusa", label: "Chiuse" },
    { value: "tutte", label: "Tutte" },
] as const;
