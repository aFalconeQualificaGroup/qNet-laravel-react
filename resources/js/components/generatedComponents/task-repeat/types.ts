// ============================================================================
// TYPES
// ============================================================================

export interface TaskRepeatConfig {
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | '';
  interval: number;
  startDate: string;
  endType: 'never' | 'date' | 'occurrences' | '';
  endDate?: string;
  occurrences?: number;
  weekDays?: number[];
  monthDay?: number;
  monthType?: 'day' | 'weekday';
  yearMonth?: number;
  startTime: string;
  endTime: string;
  workDaysOnly: boolean;
  excludeHolidays: boolean;
}

export interface TaskRepeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: TaskRepeatConfig) => void;
  initialConfig?: Partial<TaskRepeatConfig>;
}

export type TaskForm = {
    title: string;
    description: string;
    task_type: string;
    priority: string;
    note: string;
    assignee_ids: number[];
    observer_ids: number[];
    contact_ids: number[];
    due_date: string | null;
    start_date: string | null;
    is_completed_task: boolean;
    client_id: string;
    collegato_id: string;
    feedback_required: boolean;
    is_private: boolean;
    repeat_task: boolean;
    documents?: File[];
    subtasks?: any[];
    notes?: {
      mention: number[];
      content: string;
    }
};
