// UserMentionedDropdown - Select per menzionare utenti nelle note (da renderizzare dopo Editor)
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { UserType } from "@/pages/Tasks/create";
import { getUserInitials, getUserFullName } from "./utils";
import { AtSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserMentionedDropdownProps = {
    users: UserType['filtered_users'];
    onSelectUser: (userId: number) => void;
    selectedUsers?: number[];
    open: boolean;
    onClose: () => void;
    setFilter?: (v: string) => void;
};

export const UserMentionedDropdown: React.FC<UserMentionedDropdownProps> = ({
    users,
    onSelectUser,
    selectedUsers = [],
    open,
    onClose,
    setFilter
}) => {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (open) {
            setSearchValue("");
        }
    }, [open]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        if (val.length > 0) {
            setFilter?.(val);
        } else {
            setFilter?.('');
        }
    };

    const handleSelectUser = (userId: number) => {
        onSelectUser(userId);
        setSearchValue("");
        setFilter?.('');
        // Non chiudiamo più il dropdown, permettiamo selezioni multiple
        // onClose();
    };

    // Filtra gli utenti localmente in base alla ricerca
    const filteredUsers = users?.filter(user => {
        if (!searchValue) return true;
        const fullName = getUserFullName(user?.name, user?.last_name).toLowerCase();
        return fullName.includes(searchValue.toLowerCase());
    });

    if (!open) return null;

    return (
        <div className="border rounded-lg bg-background shadow-lg mt-2 overflow-hidden">
            {/* Header con ricerca */}
            <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                    placeholder="Cerca utente da menzionare..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="h-8 flex-1"
                    autoFocus
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClose}
                    title="Chiudi"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Lista utenti */}
            <div className="max-h-[280px] overflow-y-auto">
                {filteredUsers?.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        Nessun utente trovato
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredUsers?.map((user) => {
                            const isSelected = selectedUsers.includes(user.id);

                            return (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleSelectUser(user.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left group ${isSelected ? "bg-accent/50 user-selected" : ""}`}
                                >
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${isSelected ? "bg-primary text-primary-foreground user-avatar-selected" : "bg-muted text-muted-foreground"}`}>
                                        {getUserInitials(user?.name, user?.last_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium text-sm truncate transition-colors ${isSelected ? "text-primary" : "group-hover:text-primary"}`}>
                                            {getUserFullName(user?.name, user?.last_name)}
                                        </div>
                                        {user.role && (
                                            <div className="text-xs text-muted-foreground truncate">
                                                {user.role}
                                                {user.company && ` • ${user.company}`}
                                            </div>
                                        )}
                                    </div>
                                    {isSelected ? (
                                        <span className="text-primary font-bold">✓</span>
                                    ) : (
                                        <AtSign className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};