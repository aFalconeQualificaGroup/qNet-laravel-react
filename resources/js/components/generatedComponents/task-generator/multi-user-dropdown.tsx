// MultiUserDropdown - Dropdown multi-select per utenti (assegnatari/osservatori)
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { User, X } from "lucide-react";

type UserItem = {
    id: number;
    name: string;
};

type MultiUserDropdownProps = {
    users?: UserItem[];
    value?: UserItem[];
    onChange: (users: UserItem[]) => void;
    onFilter?: (search: string) => void;
    title?: string;
    placeholder?: string;
};

export const MultiUserDropdown: React.FC<MultiUserDropdownProps> = ({ 
    users = [], 
    value = [], 
    onChange, 
    onFilter,
    title = "Seleziona utenti",
    placeholder = "Cerca utente..."
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearch = (searchValue: string) => {
        setSearch(searchValue);
        onFilter?.(searchValue);
    };

    const handleToggle = (user: UserItem) => {
        const isSelected = value.some(u => u.id === user.id);
        if (isSelected) {
            onChange(value.filter(u => u.id !== user.id));
        } else {
            onChange([...value, user]);
        }
    };

    const handleRemove = (userId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        onChange(value.filter(u => u.id !== userId));
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
        setSearch("");
    };

    const filteredUsers = search 
        ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
        : users;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-button-sm border-2 hover:bg-accent w-full justify-start min-h-10 h-auto"
                >
                    <User className="h-4 w-4 mr-2 shrink-0" />
                    <div className="flex-1 flex flex-wrap gap-1 items-center text-left">
                        {value.length === 0 ? (
                            <span className="text-muted-foreground">{title}</span>
                        ) : (
                            value.map(user => (
                                <span 
                                    key={user.id} 
                                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium"
                                >
                                    {user.name}
                                    <X
                                        className="h-3 w-3 hover:text-destructive cursor-pointer"
                                        onClick={(e) => handleRemove(user.id, e)}
                                    />
                                </span>
                            ))
                        )}
                    </div>
                    {value.length > 0 && (
                        <X
                            className="h-4 w-4 ml-2 shrink-0 hover:text-destructive"
                            onClick={handleClearAll}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-xl" align="start">
                <div className="p-3 border-b bg-muted">
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="text-sm modern-input"
                        autoFocus
                    />
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/50">
                        {value.length > 0 ? `${value.length} selezionati` : 'Seleziona utenti'}
                    </div>
                    {filteredUsers.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-6">
                            Nessun utente trovato
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const isSelected = value.some(u => u.id === user.id);
                            
                            return (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleToggle(user)}
                                    className={`w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left transition-colors ${isSelected ? 'user-selected' : ''}`}
                                >
                                    <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'user-avatar-selected' : ''}`}>
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">
                                            {user.name}
                                        </div>
                                    </div>
                                    {isSelected && <span className="text-primary">✓</span>}
                                </button>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
