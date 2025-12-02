// SubtaskManager - Gestione sottoattività
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarCompact } from "./calendar-compact";
import { UserDropdown } from "./user-dropdown";
import { PrioritySelector } from "./priority-selector";
import { TaskTypeButton } from "./task-type-button";
import { Subtask, SubtaskManagerProps } from "./types";
import { TASK_TYPES, PRIORITIES } from "./constants";

export const SubtaskManager: React.FC<SubtaskManagerProps> = ({ 
    subtasks, 
    onChange, 
    users,
    onFilterUsers
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const today_date = new Date().toISOString();
    const [currentSubtask, setCurrentSubtask] = useState<Subtask>({
        title: "",
        description: "",
        task_type: "todo",
        priority: "normal",
        assignee_ids: [],
        observer_ids: [],
        due_date: null,
        start_date: today_date,
        is_completed: false,
    });
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showDescriptionInput, setShowDescriptionInput] = useState(false);
    const [usersFilterValue, setUsersFilterValue] = useState("");

    const resetForm = () => {
        const today_date = new Date().toISOString();
        setCurrentSubtask({
            title: "",
            description: "",
            task_type: "todo",
            priority: "normal",
            assignee_ids: [],
            observer_ids: [],
            due_date: null,
            start_date: today_date,
            is_completed: false,
        });
        setShowDescriptionInput(false);
        setEditingId(null);
        setShowAddForm(false);
    };

    const handleAdd = () => {
        if (!currentSubtask.title.trim()) return;

        const newSubtask = {
            ...currentSubtask,
            id: Date.now().toString(),
        };

        onChange([...subtasks, newSubtask]);
        resetForm();
    };

    const handleUpdate = () => {
        if (!currentSubtask.title.trim() || !editingId) return;

        const updatedSubtasks = subtasks.map(st => 
            st.id === editingId ? { ...currentSubtask, id: editingId } : st
        );

        onChange(updatedSubtasks);
        resetForm();
    };

    const handleEdit = (subtask: Subtask) => {
        setCurrentSubtask(subtask);
        setEditingId(subtask.id || null);
        setShowAddForm(true);
        if (subtask.description) {
            setShowDescriptionInput(true);
        }
    };

    const handleDelete = (id: string) => {
        onChange(subtasks.filter(st => st.id !== id));
    };

    const handleToggleComplete = (id: string) => {
        const updatedSubtasks = subtasks.map(st =>
            st.id === id ? { ...st, is_completed: !st.is_completed } : st
        );
        onChange(updatedSubtasks);
    };

    const handleTaskTypeToggle = () => {
        const currentIndex = TASK_TYPES.findIndex((t) => t.id === currentSubtask.task_type);
        const nextIndex = (currentIndex + 1) % TASK_TYPES.length;
        setCurrentSubtask({ ...currentSubtask, task_type: TASK_TYPES[nextIndex].id });
    };

    const setField = <K extends keyof Subtask>(key: K, value: Subtask[K]) => {
        setCurrentSubtask({ ...currentSubtask, [key]: value });
    };

    return (
        <div className="space-y-3">
            {/* Lista sottoattività esistenti */}
            {subtasks.length > 0 && (
                <div className="space-y-2">
                    {subtasks.map((subtask) => {
                        const taskType = TASK_TYPES.find(t => t.id === subtask.task_type);
                        const priority = PRIORITIES.find(p => p.id === subtask.priority);
                        const assigneeNames = subtask.assignee_ids
                            .map(id => users?.find(u => u.id === id)?.name)
                            .filter(Boolean)
                            .join(", ");

                        return (
                            <Card 
                                key={subtask.id} 
                                className={`p-3 ${subtask.is_completed ? 'opacity-60 bg-muted' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Checkbox completamento */}
                                    <input
                                        type="checkbox"
                                        checked={subtask.is_completed}
                                        onChange={() => handleToggleComplete(subtask.id!)}
                                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                                    />

                                    <div className="flex-1 min-w-0">
                                        {/* Titolo e descrizione */}
                                        <div className={subtask.is_completed ? 'line-through' : ''}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{taskType?.icon}</span>
                                                <span className="font-medium text-sm">{subtask.title}</span>
                                                {priority?.id !== 'normal' && (
                                                    <span className="text-base" title={priority?.label}>
                                                        {priority?.icon}
                                                    </span>
                                                )}
                                            </div>
                                            {subtask.description && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {subtask.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Info aggiuntive */}
                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                            {subtask.due_date && (
                                                <span>📅 {new Date(subtask.due_date).toLocaleDateString('it-IT')}</span>
                                            )}
                                            {assigneeNames && (
                                                <span>👥 {assigneeNames}</span>
                                            )}
                                            {subtask.observer_ids.length > 0 && (
                                                <span>👁️ {subtask.observer_ids.length} osservatori</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Azioni */}
                                    <div className="flex gap-1 shrink-0">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(subtask)}
                                            className="h-8 w-8 p-0"
                                            title="Modifica"
                                        >
                                            ✏️
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(subtask.id!)}
                                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                            title="Elimina"
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Form aggiunta/modifica */}
            {!showAddForm ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="w-full"
                >
                    ➕ Aggiungi sottoattività
                </Button>
            ) : (
                <Card className="p-3 border-2 border-primary">
                    <div className="space-y-3">
                        {/* Riga principale */}
                        <div className="flex gap-2 items-center">
                            <TaskTypeButton 
                                value={currentSubtask.task_type} 
                                onToggle={handleTaskTypeToggle} 
                            />

                            <Input
                                type="text"
                                value={currentSubtask.title}
                                onChange={(e) => setField("title", e.target.value)}
                                placeholder="Titolo sottoattività..."
                                className="flex-1 h-10 text-sm font-medium"
                                autoFocus
                            />

                            <CalendarCompact 
                                value={currentSubtask.due_date} 
                                onChange={(iso) => setField("due_date", iso)} 
                                label="Data scadenza" 
                            />

                            <PrioritySelector 
                                value={currentSubtask.priority} 
                                onChange={(v) => setField("priority", v)} 
                                open={showPriorityDropdown}
                                onOpenChange={setShowPriorityDropdown}
                            />

                            <UserDropdown 
                                users={users} 
                                value={currentSubtask.assignee_ids} 
                                onChange={(v) => setField("assignee_ids", v)} 
                                title="Assegnatari" 
                                setFilter={onFilterUsers} 
                                icon="👥" 
                            />

                            <UserDropdown 
                                users={users} 
                                value={currentSubtask.observer_ids} 
                                onChange={(v) => setField("observer_ids", v)} 
                                title="Osservatori" 
                                setFilter={onFilterUsers} 
                                icon="👁️" 
                            />
                        </div>

                        {/* Descrizione */}
                        {!showDescriptionInput ? (
                            <Button
                                type="button"
                                onClick={() => setShowDescriptionInput(true)}
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                            >
                                Aggiungi descrizione...
                            </Button>
                        ) : (
                            <Input
                                type="text"
                                value={currentSubtask.description}
                                onChange={(e) => setField("description", e.target.value)}
                                onBlur={() => {
                                    if (!currentSubtask.description) setShowDescriptionInput(false);
                                }}
                                placeholder="Descrizione (opzionale)"
                                className="w-full text-xs"
                            />
                        )}

                        {/* Azioni */}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={resetForm}
                            >
                                Annulla
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={editingId ? handleUpdate : handleAdd}
                                disabled={!currentSubtask.title.trim()}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {editingId ? "Aggiorna" : "Aggiungi"}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {subtasks.length === 0 && !showAddForm && (
                <p className="text-center text-muted-foreground text-sm py-4">
                    Nessuna sottoattività. Clicca il bottone sopra per aggiungerne una.
                </p>
            )}
        </div>
    );
};
