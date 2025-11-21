// Main exports for Task Generator components
export { AddTaskForm } from './add-task-form';

// Sub-components export
export { CalendarCompact } from './calendar-compact';
export { UserDropdown } from './user-dropdown';
export { PrioritySelector } from './priority-selector';
export { TaskTypeButton } from './task-type-button';
export { TaskPreview } from './task-preview';
export { SubtaskManager } from './subtask-manager';

// Types export
export type { AddTaskProps, TaskForm, TaskRepeatConfig, User, Client, Contact, Commessa, ExpandedSections, Subtask, SubtaskManagerProps } from './types';

// Utils export
export { fmtDateHuman, formatDateParts, calculateQuickDate, getUserInitials, getUserFullName } from './utils';

// Constants export
export { TASK_TYPES, PRIORITIES, MONTHS, QUICK_DATE_OPTIONS, FILTER_STATUS_OPTIONS } from './constants';
