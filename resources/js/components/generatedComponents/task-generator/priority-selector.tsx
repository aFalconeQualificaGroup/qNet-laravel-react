// PrioritySelector - Selettore priorità con popover
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { PRIORITIES } from "./constants";

type PrioritySelectorProps = {
    value: string;
    onChange: (value: string) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ 
    value, 
    onChange, 
    open, 
    onOpenChange 
}) => {
    const currentPriority = PRIORITIES.find((p) => p.id === value);

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 px-4 rounded-button-sm border-2 hover:bg-accent">
                    <span className="text-lg">{currentPriority?.icon}</span>
                    <span className="ml-1 text-xs">Priorità</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
                <div className="py-1">
                    {PRIORITIES.map((p) => (
                        <Button
                            key={p.id}
                            type="button"
                            onClick={() => {
                                onChange(p.id);
                                onOpenChange(false);
                            }}
                            variant="ghost"
                            className="priority-option w-full justify-start text-xs hover:bg-accent"
                        >
                            <span className="text-base">{p.icon}</span>
                            <span>{p.label}</span>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
