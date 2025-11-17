// AddTaskMonolith.tsx
// Replica fedele della struttura HTML fornita usando shadcn/ui
// Struttura: header gradient, riga principale, preview, sezioni espandibili, calendario compatto, dropdown utenti

import React, { useEffect, useState, useRef } from "react";
import { TaskRepeatConfig, TaskRepeatForm, TaskRepeatModal } from '@/components/generatedComponents/task-repeat';
import "./add-task-monolith.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TaskForm } from "../task-repeat/types";

type User = {
    id: number;
    name?: string;
    label?: string;
    role?: string;
    company?: string;
};

type Client = {
    value: number;
    label: string;
};

type Contact = {
    value: number;
    label: string;
    client_id: number;
    role?: string;
    company?: string;
};

type AddTaskProps = {
    onSubmit?: (json: TaskForm) => void;
    repeatConfig: Partial<TaskRepeatConfig>;
    onChangeConfig: (config: Partial<TaskRepeatConfig> | ((prev: Partial<TaskRepeatConfig>) => Partial<TaskRepeatConfig>)) => void;
    form: TaskForm;
    handleFormDataChange: (key: keyof TaskForm, value: any) => void;
};

const fmtDateHuman = (d: Date | null): string => {
    if (!d) return "";
    return d.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

/* ---------------- CalendarCompact (controlled) - REPLICA HTML FORNITO ---------------- */
const CalendarCompact: React.FC<{
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
}> = ({ value, onChange, label = "Data" }) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [selectedTime, setSelectedTime] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [hasSelectedTime, setHasSelectedTime] = useState(false);

    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
            const hours = date.getHours();
            const minutes = date.getMinutes();
            setSelectedTime(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
            setHasSelectedTime(true);
        }
    }, [value]);

    const selectQuick = (type: string) => {
        const today = new Date();
        let targetDate = new Date();
        let targetTime = "09:00";

        switch (type) {
            case "oggi":
                targetTime = "23:59";
                break;
            case "domani":
                targetDate.setDate(today.getDate() + 1);
                break;
            case "dopodomani":
                targetDate.setDate(today.getDate() + 2);
                break;
            case "settimana":
                targetDate.setDate(today.getDate() + 7);
                break;
            case "dueset":
                targetDate.setDate(today.getDate() + 14);
                break;
            case "mese":
                targetDate.setMonth(today.getMonth() + 1);
                break;
            case "lunedi":
                const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
                targetDate.setDate(today.getDate() + daysUntilMonday);
                break;
            case "venerdi":
                const daysUntilFriday = (12 - today.getDay()) % 7 || 7;
                targetDate.setDate(today.getDate() + daysUntilFriday);
                break;
            case "fine_mese":
                targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                targetTime = "18:00";
                break;
        }

        setSelectedDate(targetDate);
        setSelectedTime(targetTime);
        setHasSelectedTime(true);
        setCurrentMonth(targetDate.getMonth());
        setCurrentYear(targetDate.getFullYear());
    };

    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const prevLastDay = new Date(currentYear, currentMonth, 0);

        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const lastDate = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        const days = [];

        for (let i = firstDayOfWeek; i > 0; i--) {
            days.push({ day: prevLastDate - i + 1, isDisabled: true, isCurrentMonth: false });
        }

        const today = new Date();
        for (let day = 1; day <= lastDate; day++) {
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = selectedDate && day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

            days.push({ day, isToday, isSelected, isCurrentMonth: true });
        }

        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({ day, isDisabled: true, isCurrentMonth: false });
        }

        return days;
    };

    const selectDate = (day: any) => {
        if (!day.isDisabled) {
            const newDate = new Date(currentYear, currentMonth, day.day);
            setSelectedDate(newDate);
        }
    };

    const selectTime = (time: string) => {
        setSelectedTime(time);
        setHasSelectedTime(true);
    };

    const confirmSelection = () => {
        if (selectedDate) {
            if (hasSelectedTime && selectedTime) {
                const [hours, minutes] = selectedTime.split(":");
                selectedDate.setHours(parseInt(hours), parseInt(minutes));
            }
            onChange(selectedDate.toISOString());
            setOpen(false);
        }
    };

    const changeMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" aria-label={label} className="rounded-button-sm">
                    {selectedDate ? fmtDateHuman(selectedDate) : "Seleziona data"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0" align="end">
                <div className="bg-primary text-primary-foreground px-3 py-2 text-xs">
                    {selectedDate
                        ? `${selectedDate.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })} ${hasSelectedTime && selectedTime ? selectedTime : ""}`
                        : "Seleziona data"}
                </div>

                <div className="flex">
                    {/* Colonna quick actions */}
                    <div className="w-1/3 bg-muted p-2 border-r">
                        <h4 className="text-xs font-bold text-muted-foreground mb-1">RAPIDO</h4>
                        <div className="space-y-1">
                            <Button type="button" onClick={() => selectQuick("oggi")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                📌 Oggi
                            </Button>
                            <Button type="button" onClick={() => selectQuick("domani")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                ⏰ Domani
                            </Button>
                            <Button type="button" onClick={() => selectQuick("dopodomani")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                📆 Dopodomani
                            </Button>
                            <Button type="button" onClick={() => selectQuick("settimana")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                📊 +1 settimana
                            </Button>
                            <Button type="button" onClick={() => selectQuick("dueset")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                📈 +2 settimane
                            </Button>
                            <Button type="button" onClick={() => selectQuick("mese")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                🗓️ +1 mese
                            </Button>
                            <hr className="my-1" />
                            <Button type="button" onClick={() => selectQuick("lunedi")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                🔵 Lunedì prossimo
                            </Button>
                            <Button type="button" onClick={() => selectQuick("venerdi")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                🎉 Venerdì prossimo
                            </Button>
                            <Button type="button" onClick={() => selectQuick("fine_mese")} variant="outline" size="sm" className="quick-btn w-full justify-start">
                                📝 Fine mese
                            </Button>
                        </div>
                    </div>

                    {/* Colonna calendario */}
                    <div className="flex-1 p-2">
                        <div className="flex items-center justify-between mb-2">
                            <Button type="button" onClick={() => changeMonth(-1)} variant="ghost" size="sm" className="p-1 h-auto">
                                ←
                            </Button>
                            <div className="flex items-center gap-1">
                                <Select value={String(currentMonth)} onValueChange={(v) => setCurrentMonth(parseInt(v))}>
                                    <SelectTrigger className="w-16 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month, index) => (
                                            <SelectItem key={index} value={String(index)}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={String(currentYear)} onValueChange={(v) => setCurrentYear(parseInt(v))}>
                                    <SelectTrigger className="w-20 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[2024, 2025, 2026].map((year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={() => changeMonth(1)} variant="ghost" size="sm" className="p-1 h-auto">
                                →
                            </Button>
                        </div>

                        <div className="calendar-grid text-xs font-semibold text-muted-foreground mb-1">
                            <div>L</div>
                            <div>M</div>
                            <div>M</div>
                            <div>G</div>
                            <div>V</div>
                            <div>S</div>
                            <div>D</div>
                        </div>
                        <div className="calendar-grid mb-2">
                            {generateCalendarDays().map((day, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectDate(day)}
                                    className={`calendar-day ${day.isDisabled ? "disabled" : ""} ${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-2">
                            <h4 className="text-xs font-bold text-muted-foreground mb-1">ORARIO</h4>

                            <div className="grid grid-cols-4 gap-1 mb-1">
                                {["09:00", "12:00", "15:00", "18:00"].map((time) => (
                                    <div key={time} onClick={() => selectTime(time)} className={`time-slot ${selectedTime === time ? "selected" : ""}`}>
                                        {time}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-1">
                                <Select
                                    value={selectedTime ? selectedTime.split(":")[0] : "09"}
                                    onValueChange={(v) => {
                                        const mins = selectedTime ? selectedTime.split(":")[1] : "00";
                                        setSelectedTime(`${v}:${mins}`);
                                        setHasSelectedTime(true);
                                    }}
                                >
                                    <SelectTrigger className="flex-1 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                                {String(i).padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="flex items-center text-xs">:</span>
                                <Select
                                    value={selectedTime ? selectedTime.split(":")[1] : "00"}
                                    onValueChange={(v) => {
                                        const hrs = selectedTime ? selectedTime.split(":")[0] : "09";
                                        setSelectedTime(`${hrs}:${v}`);
                                        setHasSelectedTime(true);
                                    }}
                                >
                                    <SelectTrigger className="flex-1 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                                {String(i).padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t p-2 bg-muted flex justify-end">
                    <Button type="button" onClick={confirmSelection} size="sm">
                        Conferma
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

/* ---------------- UserDropdown (multi-select controlled) - REPLICA HTML FORNITO ---------------- */
const UserDropdown: React.FC<{
    users: User[];
    value: number[];
    onChange: (v: number[]) => void;
    title?: string;
    showRoleCompany?: boolean;
}> = ({ users, value, onChange, title = "Seleziona utenti", showRoleCompany = true }) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("");

    const toggle = (id: number) => {
        onChange(value.includes(id) ? value.filter((i) => i !== id) : [...value, id]);
    };

    const filtered = users.filter((u) => (u.name || u.label || "").toLowerCase().includes(filter.toLowerCase()));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-button-sm">
                    {value.length ? `${value.length} selezionati` : title}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
                <div className="p-3 border-b">
                    <Input placeholder="Cerca..." value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm" autoFocus />
                </div>

                <div className="py-2 max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">{title}</div>
                    {filtered.map((user) => {
                        const displayName = user.name || user.label;
                        const initials = displayName
                            ? displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "";
                        const userId = user.id;
                        const isSelected = value.includes(userId);

                        return (
                            <button
                                key={userId}
                                type="button"
                                onClick={() => toggle(userId)}
                                className={`w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left transition-colors ${isSelected ? "user-selected" : ""}`}
                            >
                                <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? "user-avatar-selected" : ""}`}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{displayName}</div>
                                    {showRoleCompany && (user.role || user.company) && <div className="user-role-info truncate">{[user.role, user.company].filter(Boolean).join(" - ")}</div>}
                                </div>
                                {isSelected && <span className="text-primary">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};

/* ---------------- Main Component - REPLICA FEDELE HTML FORNITO ---------------- */
export default function AddTaskMonolith({ onSubmit, repeatConfig, onChangeConfig, form, handleFormDataChange }: AddTaskProps) {
   
    useEffect(() => {
        console.log(form)
        setExpandedSections(prev => ({ ...prev, ripeti: form.repeat_task }));
    }, [form]);

    const setField = <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => handleFormDataChange(key, value);

    // Stati UI
    const [titleFocused, setTitleFocused] = useState(false);
    const [showDescriptionInput, setShowDescriptionInput] = useState(false);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        altro: false,
        documenti: false,
        sottoattivita: false,
        note: false,
        ripeti: false
    });
    const [activeTab, setActiveTab] = useState<"commessa" | "opportunity">("commessa");
    const [filterStatus, setFilterStatus] = useState<"in_lavorazione" | "chiusa" | "tutte">("in_lavorazione");
    const [searchCommesse, setSearchCommesse] = useState("");

    const descriptionInputRef = useRef<HTMLInputElement>(null);

    // Mock data - replace with props or fetch in real integration
    const users: User[] = [
        { id: 1, name: "Mario Rossi", role: "Project Manager", company: "TechCorp" },
        { id: 2, name: "Giulia Bianchi", role: "Developer", company: "TechCorp" },
        { id: 3, name: "Luca Verdi", role: "Designer", company: "DesignStudio" },
        { id: 4, name: "Anna Neri", role: "CEO", company: "StartupX" },
        { id: 5, name: "Paolo Gialli", role: "CTO", company: "StartupX" },
    ];

    const clients: Client[] = [
        { value: 1, label: "QUALIFICA GROUP S.r.l." },
        { value: 2, label: "Azienda ABC" },
        { value: 3, label: "Studio Legale XYZ" },
    ];

    const contacts: Contact[] = [
        { value: 101, label: "Giuseppe Verdi", client_id: 1, role: "CEO", company: "QUALIFICA GROUP" },
        { value: 102, label: "Maria Rossi", client_id: 1, role: "CFO", company: "QUALIFICA GROUP" },
        { value: 103, label: "Antonio Bianchi", client_id: 2, role: "Manager", company: "Azienda ABC" },
        { value: 104, label: "Laura Neri", client_id: 1, role: "Responsabile Acquisti", company: "QUALIFICA GROUP" },
    ];

    type Commessa = {
        id: number;
        code: string;
        name: string;
        client_id: number;
        status: string;
        type: "commessa" | "opportunity";
    };

    const opportunities: Commessa[] = [
        { id: 1, code: "5681", name: "prova aggiunta iso 19/12/23_3", client_id: 1, status: "in_lavorazione", type: "opportunity" },
        { id: 2, code: "5588", name: "d_aleo_3", client_id: 1, status: "in_lavorazione", type: "opportunity" },
    ];

    const commesse: Commessa[] = [
        { id: 291, code: "291", name: "Iso 9001_1", client_id: 1, status: "in_lavorazione", type: "commessa" },
        { id: 294, code: "294", name: "Iso_prova_2022_1", client_id: 1, status: "in_lavorazione", type: "commessa" },
        { id: 1747, code: "1747", name: "Sviluppo Software", client_id: 1, status: "chiusa", type: "commessa" },
        { id: 2214, code: "2214", name: "UNI EN ISO 9001:2015", client_id: 1, status: "in_lavorazione", type: "commessa" },
    ];

    const TASK_TYPES = [
        { id: "call", icon: "📞", label: "Telefonata" },
        { id: "meeting", icon: "🤝", label: "Appuntamento" },
        { id: "todo", icon: "✔️", label: "To-Do" },
    ];

    const priorities = [
        { id: "low", label: "Bassa", icon: "🟢" },
        { id: "normal", label: "Normale", icon: "🔵" },
        { id: "high", label: "Alta", icon: "🟠" },
        { id: "urgent", label: "Urgente", icon: "🔴" },
    ];

    const contactsForClient = contacts.filter((c) => String(c.client_id) === String(form.client_id));

    const collegatoItems = [...commesse, ...opportunities].filter((item) => {
        const clientId = parseInt(form.client_id);
        if (!clientId || item.client_id !== clientId) return false;
        if (item.type !== activeTab) return false;

        if (filterStatus !== "tutte" && item.status !== filterStatus) return false;

        if (searchCommesse) {
            const search = searchCommesse.toLowerCase();
            return item.code.toLowerCase().includes(search) || item.name.toLowerCase().includes(search);
        }

        return true;
    });

    const commesseCount = [...commesse, ...opportunities].filter((i) => {
        const clientId = parseInt(form.client_id);
        return clientId && i.client_id === clientId && i.type === "commessa";
    }).length;

    const opportunitaCount = [...commesse, ...opportunities].filter((i) => {
        const clientId = parseInt(form.client_id);
        return clientId && i.client_id === clientId && i.type === "opportunity";
    }).length;

    const currentTaskType = TASK_TYPES.find((t) => t.id === form.task_type);
    const currentPriority = priorities.find((p) => p.id === form.priority);

    const handleTaskTypeToggle = () => {
        const currentIndex = TASK_TYPES.findIndex((t) => t.id === form.task_type);
        const nextIndex = (currentIndex + 1) % TASK_TYPES.length;
        setField("task_type", TASK_TYPES[nextIndex].id);
    };

    const getAssigneeNames = () => {
        return form.assignee_ids
            .map((id) => {
                const user = users.find((u) => u.id === id);
                return user ? user.name : "";
            })
            .filter((name) => name);
    };

    const getObserverNames = () => {
        return form.observer_ids
            .map((id) => {
                const user = users.find((u) => u.id === id);
                return user ? user.name : "";
            })
            .filter((name) => name);
    };

    const getContactNames = () => {
        return form.contact_ids
            .map((id) => {
                const contact = contacts.find((c) => c.value === id);
                return contact ? contact.label : "";
            })
            .filter((name) => name);
    };

    const formatDate = (date: string | null) => {
        if (!date) return "";
        const d = new Date(date);
        const dateStr = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });

        const hours = d.getHours();
        const minutes = d.getMinutes();

        if (hours !== 0 || minutes !== 0) {
            const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            return (
                <>
                    <span className="date-display">{dateStr}</span>
                    <span className="time-display">{timeStr}</span>
                </>
            );
        }

        return <span className="date-display">{dateStr}</span>;
    };

    const clearStartDate = () => {
        setField("start_date", null);
        setShowStartDate(false);
    };

    const clearDueDate = () => {
        setField("due_date", null);
    };

    const buildPreviewComponents = () => {
        const components = [];

        if (currentTaskType && form.task_type !== "todo") {
            components.push(
                <span key="task-type" className="preview-link" onClick={() => handleTaskTypeToggle()}>
                    {currentTaskType.icon} {currentTaskType.label}
                </span>
            );
        }

        if (form.start_date) {
            components.push(
                <span key="start-date">
                    <span className="preview-link" onClick={() => setShowStartDate(true)}>
                        📅 Inizio: {formatDate(form.start_date)}
                    </span>
                </span>
            );
        }

        if (form.due_date) {
            components.push(
                <span key="due-date">
                    <span className="preview-link" onClick={() => { }}>
                        📅 Scadenza: {formatDate(form.due_date)}
                    </span>
                </span>
            );
        }

        if (form.priority !== "normal") {
            components.push(
                <span key="priority" className="preview-link" onClick={() => setShowPriorityDropdown(true)}>
                    {currentPriority?.icon} Priorità {currentPriority?.label}
                </span>
            );
        }

        const assigneeNames = getAssigneeNames();
        if (assigneeNames.length > 0) {
            components.push(
                <span key="assignees">
                    <span className="preview-link" onClick={() => { }}>
                        👥 Assegnato a:
                    </span>
                    {" " + assigneeNames.join(", ")}
                </span>
            );
        }

        const observerNames = getObserverNames();
        if (observerNames.length > 0) {
            components.push(
                <span key="observers">
                    <span className="preview-link" onClick={() => { }}>
                        👁️ Osservatore:
                    </span>
                    {" " + observerNames.join(", ")}
                </span>
            );
        }

        return components;
    };

    const previewComponents = buildPreviewComponents();

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const payload: TaskForm = { ...form };
        onSubmit?.(payload);
        console.log("TASK JSON", payload);
    };

    return (
        <div className="bg-background rounded-lg shadow-lg max-w-5xl mx-auto my-4 border">
            <form onSubmit={handleSubmit}>
                {/* HEADER */}
                <div className="px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-lg flex items-center justify-between">
                    <h2 className="text-base font-semibold">Nuovo task</h2>
                    <Button
                        type="button"
                        onClick={() => setField("is_completed_task", !form.is_completed_task)}
                        variant={form.is_completed_task ? "secondary" : "default"}
                        size="sm"
                        className="text-xs"
                    >
                        ✓ Task già completata
                    </Button>
                </div>

                <div className="p-4 space-y-3">
                    {/* RIGA PRINCIPALE */}
                    <div className="space-y-2">
                        <div
                            className={`flex gap-2 items-center p-2 rounded-lg transition-all ${titleFocused ? "task-row-highlight" : ""}`}
                        >
                            {/* Tipo Task */}
                            <Button
                                type="button"
                                onClick={handleTaskTypeToggle}
                                variant="outline"
                                size="sm"
                                className="h-10 px-4 rounded-button-sm"
                                title={currentTaskType?.label}
                            >
                                {currentTaskType?.icon}
                            </Button>

                            {/* Titolo */}
                            <Input
                                type="text"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                onFocus={() => setTitleFocused(true)}
                                onBlur={() => setTitleFocused(false)}
                                placeholder="Titolo del lavoro..."
                                className="flex-1 h-10 border-0 focus-visible:ring-0 bg-transparent"
                            />

                            {/* Data Inizio con X per cancellare */}
                            {showStartDate && (
                                <div className="relative flex items-center gap-1">
                                    <CalendarCompact value={form.start_date} onChange={(iso) => setField("start_date", iso)} label="Data inizio" />
                                    {form.start_date && (
                                        <Button
                                            type="button"
                                            onClick={clearStartDate}
                                            variant="ghost"
                                            size="sm"
                                            className="clear-date-btn h-auto p-1"
                                            title="Rimuovi data inizio"
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Freccia tra date */}
                            {showStartDate && <span className="date-arrow">→</span>}

                            {/* Data Scadenza con X per cancellare */}
                            <div className="relative flex items-center gap-1">
                                <CalendarCompact value={form.due_date} onChange={(iso) => setField("due_date", iso)} label="Data scadenza" />
                                {form.due_date && (
                                    <Button
                                        type="button"
                                        onClick={clearDueDate}
                                        variant="ghost"
                                        size="sm"
                                        className="clear-date-btn h-auto p-1"
                                        title="Rimuovi scadenza"
                                    >
                                        ✕
                                    </Button>
                                )}
                            </div>

                            {/* Priorità */}
                            <div className="relative">
                                <Popover open={showPriorityDropdown} onOpenChange={setShowPriorityDropdown}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10 px-4 rounded-button-sm">
                                            {currentPriority?.icon}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-0" align="end">
                                        <div className="py-1">
                                            {priorities.map((p) => (
                                                <Button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setField("priority", p.id);
                                                        setShowPriorityDropdown(false);
                                                    }}
                                                    variant="ghost"
                                                    className="priority-option w-full justify-start"
                                                >
                                                    <span>{p.icon}</span>
                                                    <span>{p.label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Assegnatari */}
                            <UserDropdown users={users} value={form.assignee_ids} onChange={(v) => setField("assignee_ids", v)} title="Assegnatari" />

                            {/* Osservatore */}
                            <UserDropdown users={users} value={form.observer_ids} onChange={(v) => setField("observer_ids", v)} title="Osservatori" />
                        </div>

                        {/* Descrizione opzionale */}
                        {!showDescriptionInput ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowDescriptionInput(true);
                                    setTimeout(() => descriptionInputRef.current?.focus(), 100);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground pl-14 h-auto p-1"
                            >
                                Aggiungi descrizione...
                            </Button>
                        ) : (
                            <Input
                                ref={descriptionInputRef}
                                type="text"
                                value={form.description}
                                onChange={(e) => setField("description", e.target.value)}
                                onBlur={() => {
                                    if (!form.description) setShowDescriptionInput(false);
                                }}
                                placeholder="Descrizione (opzionale)"
                                className="w-full pl-14 pr-2 py-1 text-xs border-0 focus-visible:ring-0"
                            />
                        )}

                        {/* PREVIEW */}
                        {(previewComponents.length > 0 || !showStartDate) && (
                            <div className="text-xs text-muted-foreground pl-14 flex items-center justify-between">
                                <div>
                                    {previewComponents.map((comp, idx) => (
                                        <React.Fragment key={idx}>
                                            {comp}
                                            {idx < previewComponents.length - 1 && " • "}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {!showStartDate && (
                                    <Button
                                        type="button"
                                        onClick={() => setShowStartDate(true)}
                                        variant="link"
                                        size="sm"
                                        className="text-xs h-auto p-0"
                                    >
                                        + Aggiungi data inizio
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SEZIONI COMPATTE */}
                    <div className="grid grid-cols-4 gap-2">
                        <Button
                            type="button"
                            onClick={() => setExpandedSections({ ...expandedSections, altro: !expandedSections.altro })}
                            variant="ghost"
                            className="section-compact justify-start"
                        >
                            <span className="flex items-center gap-1">
                                <span className={`text-muted-foreground transition-transform text-xs ${expandedSections.altro ? "rotate-90" : ""}`}>▶</span>
                                <span>Altro</span>
                            </span>
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setExpandedSections({ ...expandedSections, documenti: !expandedSections.documenti })}
                            variant="ghost"
                            className="section-compact justify-start"
                        >
                            <span className="flex items-center gap-1">
                                <span className={`text-muted-foreground transition-transform text-xs ${expandedSections.documenti ? "rotate-90" : ""}`}>▶</span>
                                📎 Documenti
                            </span>
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setExpandedSections({ ...expandedSections, sottoattivita: !expandedSections.sottoattivita })}
                            variant="ghost"
                            className="section-compact justify-start"
                        >
                            <span className="flex items-center gap-1">
                                <span className={`text-muted-foreground transition-transform text-xs ${expandedSections.sottoattivita ? "rotate-90" : ""}`}>▶</span>
                                ✅ Sottoattività
                            </span>
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setExpandedSections({ ...expandedSections, note: !expandedSections.note })}
                            variant="ghost"
                            className="section-compact justify-start"
                        >
                            <span className="flex items-center gap-1">
                                <span className={`text-muted-foreground transition-transform text-xs ${expandedSections.note ? "rotate-90" : ""}`}>▶</span>
                                💬 Note
                            </span>
                        </Button>
                    </div>

                    {/* CONTENUTO SEZIONI ESPANSE */}
                    {expandedSections.altro && (
                        <div className="border rounded-lg p-3 bg-muted space-y-3">
                            {/* Cliente e Contatto */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs font-semibold">Cliente</Label>
                                    <Select value={form.client_id} onValueChange={(v) => {
                                        setField("client_id", v);
                                        setField("contact_ids", []);
                                        setField("collegato_id", "");
                                    }}>
                                        <SelectTrigger className="w-full text-sm">
                                            <SelectValue placeholder="-- seleziona --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((c) => (
                                                <SelectItem key={c.value} value={String(c.value)}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {form.client_id && (
                                    <div>
                                        <Label className="text-xs font-semibold">Contatto</Label>
                                        <UserDropdown
                                            users={contactsForClient.map((c) => ({ id: c.value, name: c.label, role: c.role, company: c.company }))}
                                            value={form.contact_ids}
                                            onChange={(v) => setField("contact_ids", v)}
                                            title={form.contact_ids.length ? getContactNames().join(", ") : "Seleziona contatti"}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* COMMESSE/OPPORTUNITÀ */}
                            {form.client_id && (
                                <div className="border rounded-lg p-2 bg-background">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                onClick={() => setActiveTab("commessa")}
                                                variant="ghost"
                                                size="sm"
                                                className={`tab-button ${activeTab === "commessa" ? "active-commesse" : ""}`}
                                            >
                                                Commesse ({commesseCount})
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setActiveTab("opportunity")}
                                                variant="ghost"
                                                size="sm"
                                                className={`tab-button ${activeTab === "opportunity" ? "active-opportunita" : ""}`}
                                            >
                                                Opportunità ({opportunitaCount})
                                            </Button>
                                        </div>

                                        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                                            <SelectTrigger className="w-32 h-7 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in_lavorazione">In lavorazione</SelectItem>
                                                <SelectItem value="chiusa">Chiuse</SelectItem>
                                                <SelectItem value="tutte">Tutte</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Input
                                        placeholder="Cerca per codice o nome..."
                                        value={searchCommesse}
                                        onChange={(e) => setSearchCommesse(e.target.value)}
                                        className="mb-2 text-xs"
                                    />

                                    <div className="max-h-48 overflow-auto space-y-1">
                                        {collegatoItems.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">Nessun risultato</div>}
                                        {collegatoItems.map((item) => (
                                            <label
                                                key={item.id}
                                                className={`flex items-center gap-2 p-2 rounded hover:bg-accent text-xs cursor-pointer transition-colors ${String(form.collegato_id) === String(item.id) ? "bg-accent border border-primary" : "border border-transparent"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="collegato"
                                                    checked={String(form.collegato_id) === String(item.id)}
                                                    onChange={() => setField("collegato_id", String(item.id))}
                                                    className="shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        #{item.code} - {item.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{item.status === "in_lavorazione" ? "In lavorazione" : "Chiusa"}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Toggle buttons */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setField("feedback_required", !form.feedback_required)}
                                    variant={form.feedback_required ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs"
                                >
                                    📝 Feedback richiesto
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setField("is_private", !form.is_private)}
                                    variant={form.is_private ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs"
                                >
                                    🔒 Privato
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setField("repeat_task", !form.repeat_task)}
                                    variant={form.repeat_task ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs"
                                >
                                    🔁 Ripeti
                                </Button>
                            </div>
                        </div>
                    )}

                    {expandedSections.documenti && (
                        <div className="border rounded-lg p-4 bg-muted">
                            <div className="text-center text-muted-foreground text-sm">
                                <Button type="button" size="sm">
                                    📎 Carica documento
                                </Button>
                                <p className="text-xs mt-2">o trascina i file qui</p>
                            </div>
                        </div>
                    )}

                    {expandedSections.sottoattivita && (
                        <div className="border rounded-lg p-4 bg-muted">
                            <div className="text-center text-muted-foreground text-sm">[Qui integreremo il SubtaskManager]</div>
                        </div>
                    )}

                    {expandedSections.note && (
                        <div className="border rounded-lg p-4 bg-muted">
                            <div className="text-center text-muted-foreground text-sm">[Area note - verrà popolata dopo la creazione]</div>
                        </div>
                    )}

                    {expandedSections.ripeti && (
                        <div className="border rounded-lg p-4 bg-muted">
                            <div className='w-full flex flex-col'>
                                <TaskRepeatForm
                                    value={repeatConfig}
                                    onChange={onChangeConfig}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t bg-muted flex justify-between">
                    <Button type="button" variant="destructive" className="rounded-button">
                        Annulla
                    </Button>
                    <Button  type="submit" className="rounded-button">
                        Aggiungi
                    </Button>
                </div>
            </form>
        </div>
    );
}
