// ClientDropdown - Dropdown single-select per clienti
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Building2, X } from "lucide-react";

type Client = {
    id: number;
    name: string;
};

type ClientDropdownProps = {
    clients?: Client[];
    value?: string;
    onChange: (v: string) => void;
    onFilter?: (search: string) => void;
    title?: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export const ClientDropdown: React.FC<ClientDropdownProps> = ({
    clients = [],
    value,
    onChange,
    onFilter,
    title = "Seleziona cliente",
    icon: Icon = Building2
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedClient = clients.find(c => String(c.id) === value);

    const handleSearch = (searchValue: string) => {
        setSearch(searchValue);
        onFilter?.(searchValue);
    };

    const handleSelect = (clientId: string) => {
        onChange(clientId);
        setOpen(false);
        setSearch("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSearch("");
    };

    const filteredClients = search
        ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : clients;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-button-sm border-2 hover:bg-accent w-full justify-start"
                >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="flex-1 truncate text-left">
                        {selectedClient ? selectedClient.name : title}
                    </span>
                    {selectedClient && (
                        <X
                            className="h-4 w-4 ml-2 flex-shrink-0 hover:text-destructive"
                            onClick={handleClear}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-xl" align="start">
                <div className="p-3 border-b bg-muted">
                    <Input
                        type="text"
                        placeholder="Cerca cliente..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="text-sm modern-input"
                        autoFocus
                    />
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/50">Seleziona cliente</div>
                    {filteredClients.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-6">
                            Nessun cliente trovato
                        </div>
                    ) : (
                        filteredClients.map((client) => {
                            const isSelected = String(client.id) === value;

                            return (
                                <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => handleSelect(String(client.id))}
                                    className={`w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left transition-colors ${isSelected ? 'user-selected' : ''}`}
                                >
                                    <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'user-avatar-selected' : ''}`}>
                                        {client.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">
                                            {client.name}
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
