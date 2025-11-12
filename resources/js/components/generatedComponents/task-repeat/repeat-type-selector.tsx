import React from 'react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { TaskRepeatConfig } from './types';
import { REPEAT_TYPES } from './constants';

// ============================================================================
// REPEAT TYPE SELECTOR
// ============================================================================

interface RepeatTypeSelectorProps {
  value: TaskRepeatConfig['repeatType'];
  onChange: (value: TaskRepeatConfig['repeatType']) => void;
}

export const RepeatTypeSelector: React.FC<RepeatTypeSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="space-y-3">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Tipo di Ripetizione
    </Label>
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as TaskRepeatConfig['repeatType'])}
      className="grid grid-cols-5 gap-2"
    >
      {REPEAT_TYPES.map(({ value: v, label, icon }) => (
        <ToggleGroupItem
          key={v}
          value={v}
          className="flex flex-col gap-1 h-auto py-3"
        >
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-medium">{label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </div>
);
