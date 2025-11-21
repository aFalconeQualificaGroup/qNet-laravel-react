// TaskPreview - Preview dei componenti task selezionati
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./types";
import { TASK_TYPES, PRIORITIES } from "./constants";
import { formatDateParts } from "./utils";
import { UserType } from "@/pages/Tasks/create";

type TaskPreviewProps = {
    form: TaskForm;
    users?: UserType['filtered_users'];
    showStartDate: boolean;
    onToggleStartDate: () => void;
    onTaskTypeClick: () => void;
    onPriorityClick: () => void;
};

export const TaskPreview: React.FC<TaskPreviewProps> = ({
    form,
    users,
    showStartDate,
    onToggleStartDate,
    onTaskTypeClick,
    onPriorityClick
}) => {
    const currentTaskType = TASK_TYPES.find((t) => t.id === form.task_type);
    const currentPriority = PRIORITIES.find((p) => p.id === form.priority);

    const formatDate = (date: string | null) => {
        const { dateStr, timeStr } = formatDateParts(date);
        if (!dateStr) return null;
        
        if (timeStr) {
            return (
                <>
                    <span className="date-display">{dateStr}</span>
                    <span className="time-display">{timeStr}</span>
                </>
            );
        }
        
        return <span className="date-display">{dateStr}</span>;
    };

    const getAssigneeNames = () => {
        return form.assignee_ids
            .map((id) => {
                const user = users?.find((u) => u.id === id);
                return user ? user.name : "";
            })
            .filter((name) => name);
    };

    const getObserverNames = () => {
        return form.observer_ids
            .map((id) => {
                const user = users?.find((u) => u.id === id);
                return user ? user.name : "";
            })
            .filter((name) => name);
    };

    const buildPreviewComponents = () => {
        const components = [];

        if (currentTaskType && form.task_type !== "todo") {
            components.push(
                <span key="task-type" className="preview-link" onClick={onTaskTypeClick}>
                    {currentTaskType.icon} {currentTaskType.label}
                </span>
            );
        }

        if (form.start_date) {
            components.push(
                <span key="start-date">
                    <span className="preview-link" onClick={onToggleStartDate}>
                        📅 Inizio: {formatDate(form.start_date)}
                    </span>
                </span>
            );
        }

        if (form.due_date) {
            components.push(
                <span key="due-date">
                    <span className="preview-link" onClick={() => {}}>
                        📅 Scadenza: {formatDate(form.due_date)}
                    </span>
                </span>
            );
        }

        if (form.priority !== "normal") {
            components.push(
                <span key="priority" className="preview-link" onClick={onPriorityClick}>
                    {currentPriority?.icon} Priorità {currentPriority?.label}
                </span>
            );
        }

        const assigneeNames = getAssigneeNames();
        if (assigneeNames.length > 0) {
            components.push(
                <span key="assignees">
                    <span className="preview-link" onClick={() => {}}>
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
                    <span className="preview-link" onClick={() => {}}>
                        👁️ Osservatore:
                    </span>
                    {" " + observerNames.join(", ")}
                </span>
            );
        }

        return components;
    };

    const previewComponents = buildPreviewComponents();

    if (previewComponents.length === 0 && showStartDate) {
        return null;
    }

    return (
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
                    onClick={onToggleStartDate}
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0"
                >
                    + Aggiungi data inizio
                </Button>
            )}
        </div>
    );
};
