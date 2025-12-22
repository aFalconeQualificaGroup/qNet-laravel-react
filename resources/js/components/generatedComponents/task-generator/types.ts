// Types for Task Generator components
import { TaskForm, TaskRepeatConfig } from '../task-repeat/types';
import { UserType } from '@/pages/Tasks/create';

export type User = {
    id: number;
    name?: string;
    label?: string;
    last_name?: string;
    role?: string;
    company?: string;
};

export type Client = {
    value: number;
    label: string;
};

export type Contact = {
    value: number;
    label: string;
    client_id: number;
    role?: string;
    company?: string;
};

export type Commessa = {
    id: number;
    code: string;
    name: string;
    client_id: number;
    status: string;
    type: "commessa" | "opportunity";
};

export type AddTaskProps = {
    onSubmit?: (json: TaskForm) => void;
    onReset?: () => void;
    repeatConfig: Partial<TaskRepeatConfig>;
    onChangeConfig: (config: Partial<TaskRepeatConfig> | ((prev: Partial<TaskRepeatConfig>) => Partial<TaskRepeatConfig>)) => void;
    form: TaskForm;
    handleFormDataChange: (key: keyof TaskForm | 'notes.mention' | 'notes.content' | 'notes.full_content' | 'set_date', value: any) => void;
    users?: UserType['filtered_users'];
    clients?: UserType['filtered_clients'];
    commesse_client?: UserType['commesse_client'];
    opportunitys_client?: UserType['opportunitys_client'];
    contacts_client?: UserType['contacts_client'];
};

export type ExpandedSections = {
    altro: boolean;
    documenti: boolean;
    sottoattivita: boolean;
    note: boolean;
    ripeti: boolean;
};

export type Subtask = {
    id?: string;
    title: string;
    description: string;
    task_type: string;
    priority: string;
    assignee_ids: number[];
    observer_ids: number[];
    due_date: string | null;
    start_date: string | null;
    is_completed: boolean;
};

export type SubtaskManagerProps = {
    subtasks: Subtask[];
    onChange: (subtasks: Subtask[]) => void;
    users?: UserType['filtered_users'];
    onFilterUsers?: (filter: string) => void;
};

export type { TaskForm, TaskRepeatConfig };
