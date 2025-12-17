import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface Order {
    id: number;
    title: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OrderSelectorProps {
    orders: PaginatedOrders | null;
    value: string;
    onChange: (value: string) => void;
    onSearch: (search: string) => void;
    onLoadMore?: (page: number) => void;
    label?: string;
    placeholder?: string;
    title?: string;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
    orders,
    value,
    onChange,
    onSearch,
    onLoadMore,
    label = 'Seleziona',
    placeholder = 'Cerca...',
    title = 'Seleziona'
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const previousPageRef = useRef<number>(0);
    const loadingPageRef = useRef<number | null>(null);

    const selectedOrder = orders?.data?.find(o => String(o.id) === value);
    
    // Monitora quando arrivano nuovi dati
    useEffect(() => {
        if (orders && orders.current_page !== previousPageRef.current) {
            previousPageRef.current = orders.current_page;
            
            // Se la pagina caricata corrisponde a quella che stavamo aspettando
            if (loadingPageRef.current === orders.current_page) {
                setIsLoading(false);
                loadingPageRef.current = null;
                
                // Controlla se dobbiamo caricare ancora (l'utente è ancora in fondo)
                setTimeout(() => {
                    checkAndLoadMore();
                }, 100);
            }
        }
    }, [orders?.current_page, orders?.data?.length]);
    
    const checkAndLoadMore = () => {
        const target = scrollContainerRef.current;
        if (!target) return;
        
        const scrollThreshold = 50;
        const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < scrollThreshold;
        
        if (isNearBottom && !isLoading && orders && orders.current_page < orders.last_page && onLoadMore) {
            setIsLoading(true);
            loadingPageRef.current = orders.current_page + 1;
            onLoadMore(orders.current_page + 1);
        }
    };

    const handleSearch = (searchValue: string) => {
        setSearch(searchValue);
        if (searchValue.length >= 3) {
            onSearch(searchValue);
        }
    };

    const handleSelect = (orderId: string) => {
        onChange(orderId);
        setOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        checkAndLoadMore();
    };

    const displayOrders = orders?.data || [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-button-sm border-2 hover:bg-accent w-full justify-start"
                >
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="flex-1 truncate text-left">
                        {selectedOrder ? selectedOrder.title : title}
                    </span>
                    {selectedOrder && (
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
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="text-sm modern-input"
                        autoFocus
                    />
                </div>
                <div ref={scrollContainerRef} className="py-2 max-h-64 overflow-y-auto" onScroll={handleScroll}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/50">
                        {label}
                    </div>
                    {displayOrders.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-6">
                            Nessun risultato trovato
                        </div>
                    ) : (
                        <>
                            {displayOrders.map((order) => {
                                const isSelected = String(order.id) === value;
                                
                                return (
                                    <button
                                        key={order.id}
                                        type="button"
                                        onClick={() => handleSelect(String(order.id))}
                                        className={`w-full px-3 py-2 hover:bg-accent flex items-center gap-3 text-left transition-colors ${isSelected ? 'user-selected' : ''}`}
                                    >
                                        <div className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'user-avatar-selected' : ''}`}>
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">
                                                {order.title}
                                            </div>
                                        </div>
                                        {isSelected && <span className="text-primary">✓</span>}
                                    </button>
                                );
                            })}
                            
                            {/* Pagination Info */}
                            {orders && orders.last_page > 1 && (
                                <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/50">
                                    Pag. {orders.current_page}/{orders.last_page} • {orders.total} tot.
                                    {isLoading && <span className="ml-2">Caricamento...</span>}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
