// UserDropdown - Dropdown multi-select per utenti
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { UserType } from "@/pages/Tasks/create";
import { getUserInitials, getUserFullName } from "./utils";

type UserDropdownProps = {
    users: UserType['filtered_users'];
    value: number[];
    onChange: (v: number[]) => void;
    title?: string;
    showRoleCompany?: boolean;
    setFilter?: (v: string) => void;
    icon?: string;
};

export const UserDropdown: React.FC<UserDropdownProps> = ({ 
    users, 
    value, 
    onChange, 
    title = "Seleziona utenti", 
    showRoleCompany = true, 
    setFilter, 
    icon 
}) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
   
    const toggle = (id: number) => {
        onChange(value.includes(id) ? value.filter((i) => i !== id) : [...value, id]);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        if (val.length > 2) {
            setFilter?.(val);
        } else if (val.length === 0) {
            setFilter?.('');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-button-sm border-2 hover:bg-accent">
                    {icon && <span className="text-lg">{icon}</span>}
                    {icon && <span className="ml-1 text-xs">{title}</span>}
                    {!icon && value.length ? `👥 ${value.length} selezionati` : !icon ? title : ''}
                    {icon && value.length > 0 && <span className="ml-1 text-xs">({value.length})</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-xl" align="end">
                <div className="p-3 border-b bg-muted">
                    <Input 
                        placeholder="Cerca..." 
                        value={searchValue} 
                        onChange={handleSearchChange} 
                        className="text-sm modern-input" 
                        autoFocus 
                    />
                </div>

                <div className="py-2 max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/50">{title}</div>
                    {users?.map((user) => {
                        const userId = user.id;
                        const isSelected = value.includes(userId);
                        const initials = getUserInitials(user.name || user.label, user.last_name);
                        const fullName = getUserFullName(user.name || user.label, user.last_name);

                        return (
                            <button
                                key={userId}
                                type="button"
                                onClick={() => toggle(userId)}
                                className={`w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left transition-colors ${isSelected ? "user-selected" : ""}`}
                            >
                                <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? "user-avatar-selected" : ""}`}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{fullName}</div>
                                    {showRoleCompany && (user.role || user.company) && (
                                        <div className="user-role-info truncate">
                                            {[user.role, user.company].filter(Boolean).join(" - ")}
                                        </div>
                                    )}
                                </div>
                                {isSelected && <span className="text-primary">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};
