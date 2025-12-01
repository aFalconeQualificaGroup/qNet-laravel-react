// AddTaskForm - Componente principale per creazione task (refactored)
import React, { useEffect, useState, useRef } from "react";
import { TaskRepeatForm } from '@/components/generatedComponents/task-repeat';
import "./task-generator.css";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import * as tasksRoutes from '@/routes/tasks';

import { CalendarCompact } from "./calendar-compact";
import { UserDropdown } from "./user-dropdown";
import { UserMentionedDropdown } from "./userMentioned-dropdown";
import { PrioritySelector } from "./priority-selector";
import { TaskTypeButton } from "./task-type-button";
import { TaskPreview } from "./task-preview";
import { SubtaskManager } from "./subtask-manager";
import { AddTaskProps, Commessa } from "./types";
import { TASK_TYPES, PRIORITIES, FILTER_STATUS_OPTIONS } from "./constants";
import { Editor } from "@/components/blocks/editor-full/editor";

export const AddTaskForm: React.FC<AddTaskProps> = ({ 
    onSubmit, 
    onReset, 
    repeatConfig, 
    onChangeConfig, 
    form, 
    handleFormDataChange, 
    users, 
    clients, 
    commesse_client, 
    opportunitys_client, 
    contacts_client  
}) => {
   
    const setField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => handleFormDataChange(key, value);
    const addMentionedUser = (userId: number) => {handleFormDataChange("notes.mention", userId), console.log("Aggiunto utente menzionato:", userId);};
    const addNotesContent = (content: string) => {handleFormDataChange("notes.content", content); console.log("Aggiornato contenuto note:", content);};
    const addNotesFullContent = (fullContent: string) => {handleFormDataChange("notes.full_content", fullContent); console.log("Aggiornato contenuto completo note:", fullContent);};

    useEffect(() => {
        console.log("Utente menzionato aggiunto:", form.notes?.mention);
    }, [form.notes?.mention]);

    // Stati UI
    const [titleFocused, setTitleFocused] = useState(false);
    const [showDescriptionInput, setShowDescriptionInput] = useState(false);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        altro: false,
        documenti: false,
        sottoattivita: false,
        note: false,
        ripeti: false
    });
    const [activeTab, setActiveTab] = useState<"commessa" | "opportunity">("commessa");
    const [filterStatus, setFilterStatus] = useState<"in_lavorazione" | "chiusa" | "tutte">("tutte");
    const [searchCommesse, setSearchCommesse] = useState("");
    const [usersFilterValue, setUsersFilterValue] = useState("");
    const [clientsFilterValue, setClientsFilterValue] = useState("");

    const descriptionInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setExpandedSections(prev => ({ ...prev, ripeti: form.repeat_task }));
        
        if (!form.start_date) {
            setShowStartDate(false);
        }
        
        if (!form.description) {
            setShowDescriptionInput(false);
        }
    }, [form]);

    const handleRetriveUsersData = () => {
        if(usersFilterValue.length > 2) {
            router.get(
                tasksRoutes.create.url(),
                { search_users: usersFilterValue },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['filtered_users'],
                }
            );
        }
    };

    const handleRetriveClientsData = () => {
        if(clientsFilterValue.length > 2) {
            router.get(
                tasksRoutes.create.url(),
                { search_clients: clientsFilterValue },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['filtered_clients'],
                }
            );
        }
    };

    useEffect(() => {
        handleRetriveUsersData();
    }, [usersFilterValue]);

    useEffect(() => {
        if(clientsFilterValue !== "") {
            handleRetriveClientsData();
        }
    }, [clientsFilterValue]);

    // Mappiamo i dati dal backend
    const mappedCommesse = commesse_client?.map(comm => ({
        id: comm.id,
        code: comm.code || String(comm.id),
        name: comm.name || comm.title || "",
        client_id: comm.client_id || parseInt(form.client_id || "0"),
        status: comm.status || "in_lavorazione",
        type: "commessa" as const
    })) || [];

    const mappedOpportunities = opportunitys_client?.map(opp => ({
        id: opp.id,
        code: String(opp.id),
        name: opp.title,
        client_id: parseInt(form.client_id || "0"),
        status: opp.status,
        type: "opportunity" as const
    })) || [];

    const collegatoItems = activeTab === "opportunity"
        ? mappedOpportunities.filter((item) => {
            if (filterStatus !== "tutte" && item.status !== filterStatus) return false;
            if (searchCommesse) {
                const search = searchCommesse.toLowerCase();
                return item.code.toLowerCase().includes(search) || item.name.toLowerCase().includes(search);
            }
            return true;
        })
        : mappedCommesse.filter((item) => {
            const clientId = parseInt(form.client_id);
            if (!clientId || item.client_id !== clientId) return false;
            if (filterStatus !== "tutte" && item.status !== filterStatus) return false;
            if (searchCommesse) {
                const search = searchCommesse.toLowerCase();
                return item.code.toLowerCase().includes(search) || item.name.toLowerCase().includes(search);
            }
            return true;
        });

    const commesseCount = mappedCommesse.filter(c => c.client_id === parseInt(form.client_id || "0")).length;
    const opportunitaCount = opportunitys_client?.length || 0;
    
    const handleTaskTypeToggle = () => {
        const currentIndex = TASK_TYPES.findIndex((t) => t.id === form.task_type);
        const nextIndex = (currentIndex + 1) % TASK_TYPES.length;
        setField("task_type", TASK_TYPES[nextIndex].id);
    };

    const clearStartDate = () => {
        setField("start_date", null);
        setShowStartDate(false);
    };

    const clearDueDate = () => {
        setField("due_date", null);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        onSubmit?.(form);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 rounded-lg shadow-lg max-w-5xl mx-auto my-4 border">
            <form onSubmit={handleSubmit}>
                {/* HEADER */}
                <div className="px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-lg flex items-center justify-between">
                    <h2 className="text-base font-semibold">Nuova Attività</h2>
                    <Button
                        type="button"
                        onClick={() => setField("is_completed_task", !form.is_completed_task)}
                        variant={form.is_completed_task ? "secondary" : "outline"}
                        size="sm"
                        className={`text-xs rounded-button-sm ${form.is_completed_task ? 'bg-green-500 text-white border-green-500 hover:bg-green-600!' : 'bg-white hover:bg-gray-50! text-foreground'}`}
                    >
                        ✔ Task già completata
                    </Button>
                </div>

                <div className="p-4 space-y-3">
                    {/* RIGA PRINCIPALE */}
                    <div className="space-y-2">
                        <div className={`flex gap-2 items-center p-2 rounded-lg transition-all ${titleFocused ? "task-row-highlight" : ""}`}>
                            <TaskTypeButton value={form.task_type} onToggle={handleTaskTypeToggle} />

                            <Input
                                type="text"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                onFocus={() => setTitleFocused(true)}
                                onBlur={() => setTitleFocused(false)}
                                placeholder="Titolo del lavoro..."
                                className="flex-1 h-10 border-0 focus-visible:ring-0 bg-transparent text-sm font-medium"
                            />

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

                            {showStartDate && <span className="date-arrow">→</span>}

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

                            <PrioritySelector 
                                value={form.priority} 
                                onChange={(v) => setField("priority", v)} 
                                open={showPriorityDropdown}
                                onOpenChange={setShowPriorityDropdown}
                            />

                            <UserDropdown 
                                users={users} 
                                value={form.assignee_ids} 
                                onChange={(v) => setField("assignee_ids", v)} 
                                title="Assegnatari" 
                                setFilter={setUsersFilterValue} 
                                icon="👥" 
                            />

                            <UserDropdown 
                                users={users} 
                                value={form.observer_ids} 
                                onChange={(v) => setField("observer_ids", v)} 
                                title="Osservatori" 
                                setFilter={setUsersFilterValue} 
                                icon="👁️" 
                            />
                        </div>

                        {/* Descrizione */}
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
                        <TaskPreview 
                            form={form}
                            users={users}
                            showStartDate={showStartDate}
                            onToggleStartDate={() => setShowStartDate(true)}
                            onTaskTypeClick={handleTaskTypeToggle}
                            onPriorityClick={() => setShowPriorityDropdown(true)}
                        />
                    </div>

                    {/* SEZIONI COMPATTE */}
                    <div className="grid grid-cols-4 gap-2">
                        {['altro', 'documenti', 'sottoattivita', 'note'].map((section) => {
                            const icons: Record<string, string> = {
                                altro: '',
                                documenti: '📎 ',
                                sottoattivita: '✅ ',
                                note: '💬 '
                            };
                            const labels: Record<string, string> = {
                                altro: 'Altro',
                                documenti: 'Documenti',
                                sottoattivita: 'Sottoattività',
                                note: 'Note'
                            };
                            
                            return (
                                <Button
                                    key={section}
                                    type="button"
                                    onClick={() => setExpandedSections({ ...expandedSections, [section]: !expandedSections[section as keyof typeof expandedSections] })}
                                    variant="outline"
                                    className="section-compact justify-start h-auto bg-background hover:bg-accent"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`text-muted-foreground transition-transform text-xs ${expandedSections[section as keyof typeof expandedSections] ? "rotate-90" : ""}`}>▶</span>
                                        <span className="text-xs font-medium">{icons[section]}{labels[section]}</span>
                                    </span>
                                </Button>
                            );
                        })}
                    </div>

                    {/* SEZIONE ALTRO */}
                    {expandedSections.altro && (
                        <div className="border rounded-lg p-3 bg-muted space-y-3 fade-in">
                            {/* Cliente e Contatto */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground mb-1">Cliente</Label>
                                    <Input
                                        type="text"
                                        value={clientsFilterValue || ""}
                                        placeholder="Cerca..."
                                        onChange={(e) => setClientsFilterValue(e.target.value)}
                                        className="mb-2 text-sm modern-input"
                                    />
                                    <Select value={form.client_id} onValueChange={(v) => {
                                        setField("client_id", v);
                                        setField("contact_ids", []);
                                        setField("collegato_id", "");
                                    }}>
                                        <SelectTrigger className="w-full text-sm rounded-lg">
                                            <SelectValue placeholder="-- seleziona --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients?.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {form.client_id && (
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground mb-1">Contatto</Label>
                                        <UserDropdown
                                            users={contacts_client?.map((c) => ({ id: c.id, name: c.name, last_name: c.last_name, role: '', company: '' }))}
                                            value={form.contact_ids}
                                            onChange={(v) => setField("contact_ids", v)}
                                            title={"Seleziona contatti"}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* COMMESSE/OPPORTUNITÀ */}
                            {form.client_id && (
                                <div className="border rounded-lg p-2 bg-background">
                                    <div className="section-identifier">
                                        <span>🔗</span>
                                        <span>COLLEGATO A</span>
                                    </div>
                                    
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
                                            <SelectTrigger className="w-32 h-7 text-xs rounded-lg">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FILTER_STATUS_OPTIONS.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Input
                                        placeholder="Cerca per codice o nome..."
                                        value={searchCommesse}
                                        onChange={(e) => setSearchCommesse(e.target.value)}
                                        className="mb-2 text-xs modern-input"
                                    />

                                    <div className="max-h-48 overflow-auto space-y-1">
                                        {collegatoItems.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">Nessun risultato</div>}
                                        {collegatoItems.map((item) => (
                                            <label
                                                key={item.id}
                                                className={`flex items-center gap-2 p-2 rounded hover:bg-accent text-xs cursor-pointer transition-colors ${String(form.collegato_id) === String(item.id) ? "bg-accent border border-primary" : "border border-transparent"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="collegato"
                                                    checked={String(form.collegato_id) === String(item.id)}
                                                    onChange={() => setField("collegato_id", String(item.id))}
                                                    className="shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium">#{item.code} - {item.name}</div>
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
                                    className={`text-xs rounded-button-sm ${form.feedback_required ? 'bg-primary hover:bg-primary/90' : ''}`}
                                >
                                    📝 Feedback richiesto
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setField("is_private", !form.is_private)}
                                    variant={form.is_private ? "default" : "outline"}
                                    size="sm"
                                    className={`text-xs rounded-button-sm ${form.is_private ? 'bg-primary hover:bg-primary/90' : ''}`}
                                >
                                    🔒 Privato
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setField("repeat_task", !form.repeat_task)}
                                    variant={form.repeat_task ? "default" : "outline"}
                                    size="sm"
                                    className={`text-xs rounded-button-sm ${form.repeat_task ? 'bg-primary hover:bg-primary/90' : ''}`}
                                >
                                    🔁 Ripeti
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTI */}
                    {expandedSections.documenti && (
                        <div className="border rounded-lg p-4 bg-muted fade-in">
                            <div className="section-identifier">
                                <span>📎</span>
                                <span>DOCUMENTI ALLEGATI</span>
                            </div>
                            <div>
                                <Label htmlFor="documents" className="text-xs text-muted-foreground">Carica file</Label>
                                <Input
                                    id="documents"
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files) {
                                            setField("documents", Array.from(files));
                                        }
                                    }}
                                    className="w-full pr-2 py-1 text-xs mt-1 modern-input"
                                />
                                {form.documents && form.documents.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {form.documents.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs p-2 bg-background rounded border">
                                                <span className="truncate flex items-center gap-2">
                                                    <span>📄</span>
                                                    {file.name}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => {
                                                        const newDocs = form.documents?.filter((_, i) => i !== idx);
                                                        setField("documents", newDocs);
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SOTTOATTIVITÀ */}
                    {expandedSections.sottoattivita && (
                        <div className="border rounded-lg p-4 bg-muted fade-in">
                            <div className="section-identifier">
                                <span>✅</span>
                                <span>SOTTOATTIVITÀ</span>
                            </div>
                            <SubtaskManager
                                subtasks={form.subtasks || []}
                                onChange={(subtasks) => setField("subtasks", subtasks)}
                                users={users}
                            />
                        </div>
                    )}

                    {/* NOTE */}
                    {expandedSections.note && (
                        <div className="border rounded-lg p-4 bg-muted fade-in">
                            <div className="section-identifier">
                                <span>💬</span>
                                <span>NOTE</span>
                            </div>
                            <div className="w-full flex flex-col gap-4">
                                <Label className="text-sx text-muted-foreground m-1">Aggiungi note</Label>
                                {/* Implementiamo il componente per la creazione note con funzionalita di rich text e mentions */}
                                
                                <Editor
                                    onSerializedChange={
                                        (value) => {
                                            const textContent = value.root.children
                                                .map((child: any) => {
                                                    if (child.children && Array.isArray(child.children)) {
                                                        return child.children.map((c: any) => c.text || '').join('')
                                                    }
                                                    return ''
                                                })
                                                .join('\n')
                                            addNotesContent(textContent)
                                            addNotesFullContent(JSON.stringify(value))
                                        }
                                    }
                                    showMentions={true}
                                    mentionUsers={users}
                                    selectedMentionUsers={form.notes?.mention || []}
                                    onSelectMentionUser={addMentionedUser}
                                    onCloseMentions={() => setShowMentionDropdown(false)}
                                    onFilterMentionUsers={setUsersFilterValue}
                                />
                                
                            </div>
                        </div>
                    )}

                    {/* RIPETI */}
                    {expandedSections.ripeti && (
                        <div className="border rounded-lg p-4 bg-muted fade-in">
                            <div className="section-identifier">
                                <span>🔁</span>
                                <span>RIPETI ATTIVITÀ</span>
                            </div>
                            <div className='w-full flex flex-col'>
                                <TaskRepeatForm value={repeatConfig} onChange={onChangeConfig} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t bg-gray-50 dark:bg-gray-900 rounded-b-lg flex justify-between">
                    <Button type="button" variant="outline" className="rounded-button px-6" onClick={onReset}>
                        Reset
                    </Button>
                    <Button type="submit" className="rounded-button px-6 bg-primary hover:bg-primary/90">
                        Aggiungi
                    </Button>
                </div>
            </form>
        </div>
    );
};
