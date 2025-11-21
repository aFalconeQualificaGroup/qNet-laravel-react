// TaskTypeButton - Bottone per cambiare tipo task
import React from "react";
import { Button } from "@/components/ui/button";
import { TASK_TYPES } from "./constants";

type TaskTypeButtonProps = {
    value: string;
    onToggle: () => void;
};

export const TaskTypeButton: React.FC<TaskTypeButtonProps> = ({ value, onToggle }) => {
    const currentTaskType = TASK_TYPES.find((t) => t.id === value);

    return (
        <Button
            type="button"
            onClick={onToggle}
            variant="outline"
            size="sm"
            className="h-10 px-4 rounded-button-sm border-2 hover:bg-accent"
            title={currentTaskType?.label}
        >
            <span className="text-lg">{currentTaskType?.icon}</span>
        </Button>
    );
};
