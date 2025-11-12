// ============================================================================
// TYPES
// ============================================================================

export interface TaskRepeatConfig {
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: string;
  endType: 'never' | 'date' | 'occurrences';
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
