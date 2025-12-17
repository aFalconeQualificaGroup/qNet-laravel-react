import React, { useEffect, useState } from 'react';
import { CollegatoAState, MOCK_DATA } from './types';
import { Select } from './UI';
import { ClientDropdown } from '../generatedComponents/task-generator/client-dropdown';
import { usePage, router } from '@inertiajs/react';
import { User } from 'lucide-react';
import { UserDropdown } from '../generatedComponents/task-generator';
import { toast } from 'sonner';
import { OrderSelector } from './OrderSelector';

interface Props {
    state: CollegatoAState;
    onChange: (newState: CollegatoAState) => void;
}

export const HierarchicalFilter: React.FC<Props> = ({ state, onChange }) => {
    
    const { props } = usePage<{ 
        clientsForAdvancedFilter: { id: number; name: string }[];
        userForAdvancedFilter: { id: number; name: string }[];
        ordersForAdvancedFilter: { data: { id: number; title: string }[]; current_page: number; last_page: number; per_page: number; total: number } | null;
        opportunitysForAdvancedFilter: { data: { id: number; title: string }[]; current_page: number; last_page: number; per_page: number; total: number } | null;
    }>();
    const clients = props.clientsForAdvancedFilter || [];
    const users = props.userForAdvancedFilter || [];
    
    // State per accumulare i risultati paginati
    const [accumulatedOrders, setAccumulatedOrders] = useState<{ id: number; title: string }[]>([]);
    const [ordersPagination, setOrdersPagination] = useState<{ current_page: number; last_page: number; per_page: number; total: number } | null>(null);

    const [accumulatedOpportunitys, setAccumulatedOpportunitys] = useState<{ id: number; title: string }[]>([]);
    const [opportunitysPagination, setOpportunitysPagination] = useState<{ current_page: number; last_page: number; per_page: number; total: number } | null>(null);
    
    // Aggiorna gli ordini accumulati quando arrivano nuovi dati
    useEffect(() => {
        if (props.ordersForAdvancedFilter) {
            const newData = props.ordersForAdvancedFilter;
            
            if (newData.current_page === 1) {
                // Prima pagina: sostituisci tutto
                setAccumulatedOrders(newData.data);
            } else {
                // Pagine successive: aggiungi ai risultati esistenti
                setAccumulatedOrders(prev => [...prev, ...newData.data]);
            }
            
            setOrdersPagination({
                current_page: newData.current_page,
                last_page: newData.last_page,
                per_page: newData.per_page,
                total: newData.total
            });
        }
    }, [props.ordersForAdvancedFilter]);
    
    // Crea l'oggetto clientOrders con i dati accumulati
    const clientOrders = ordersPagination ? {
        data: accumulatedOrders,
        current_page: ordersPagination.current_page,
        last_page: ordersPagination.last_page,
        per_page: ordersPagination.per_page,
        total: ordersPagination.total
    } : null;

    const clientOpportunitys = opportunitysPagination ? {
        data: accumulatedOpportunitys,
        current_page: opportunitysPagination.current_page,
        last_page: opportunitysPagination.last_page,
        per_page: opportunitysPagination.per_page,
        total: opportunitysPagination.total
    } : null;
  
    const setClientsFilterValue = (search: string) => {
        if (search.length < 3) return;
        
        router.reload({
            only: ['clientsForAdvancedFilter'],
            data: { search },
        })
    };

    const setUsersFilterValue = (search: string) => {
        if (search.length < 3) return;
        
        router.reload({
            only: ['userForAdvancedFilter'],
            data: { search },
        });
    }

    const getClientOrders = (search: string = '', page: number = 1) => {
        if(!state.azienda){
            toast.error("Seleziona un'azienda per caricare le commesse.");
            return;
        }

        router.reload({
            only: ['ordersForAdvancedFilter'],
            data: {
                search: search,
                client_id: state.azienda,
                page: page
            }
        });
    }

    const getClientsOpportunitys = (search: string = '', page: number = 1) => {
        if(!state.azienda){
            toast.error("Seleziona un'azienda per caricare le opportunità.");
            return;
        }

        router.reload({
            only: ['opportunitysForAdvancedFilter'],
            data: {
                search: search,
                client_id: state.azienda,
                page: page
            }
        });
    }

    const loadMoreOpportunitys = (page: number) => {
        getClientsOpportunitys('', page);
    }

    const loadMoreOrders = (page: number) => {
        getClientOrders('', page);
    }

    useEffect(() => {
        if(state.azienda){
            getClientOrders('', 1);
        }
    }, [state.azienda]);

    const update = (field: keyof CollegatoAState, value: string) => {
        const newState = { ...state, [field]: value };

        // Reset children when parent changes
        if (field === 'tipo') {
            newState.azienda = '';
            newState.contatto = '';
            newState.sottoTipo = 'Nessuno';
            newState.commessa = '';
            newState.opportunita = '';
        } else if (field === 'azienda') {
            newState.sottoTipo = 'Nessuno';
            newState.commessa = '';
            newState.opportunita = '';
        } else if (field === 'sottoTipo') {
            newState.commessa = '';
            newState.opportunita = '';
        }

        onChange(newState);
    };

    return (
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Level 1 */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Tipo Collegamento
                    </label>
                    <div className="flex gap-4">
                        {MOCK_DATA.tipoCollegamento.map((t) => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${state.tipo === t ? 'border-primary-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                    {state.tipo === t && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                                </div>
                                <input
                                    type="radio"
                                    name="tipo"
                                    className="hidden"
                                    checked={state.tipo === t}
                                    onChange={() => update('tipo', t)}
                                />
                                <span className={`text-sm ${state.tipo === t ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{t}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Level 2: Azienda Selection */}
                {state.tipo === 'Azienda' && (
                    <div className="animate-fade-in-down">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Seleziona Azienda
                        </label>
                        
                        <ClientDropdown
                            clients={clients}
                            value={state.azienda}
                            onChange={(v) => {
                               update('azienda', v);
                            }}
                            onFilter={setClientsFilterValue}
                            title="Seleziona azienda"
                        />
                    </div>
                )}

                {/* Level 2: Contatto Selection */}
                {state.tipo === 'Contatto' && (
                    <div className="animate-fade-in-down">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Seleziona Contatto
                        </label>
                        <ClientDropdown
                            clients={users}
                            value={state.contatto}
                            onChange={(v) => {
                               update('contatto', v);
                            }}
                            onFilter={setUsersFilterValue}
                            title="Seleziona contatto"
                            icon={User}
                        />
                    </div>
                )}
            </div>

            {/* Level 3: Sotto-collegamento (Only for Azienda) */}
            {state.tipo === 'Azienda' && state.azienda && (
                <div className="pt-3 border-t border-slate-200 animate-fade-in-down">
                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Specifica Contesto
                    </label>
                    <div className="flex gap-4 mb-4">
                        {MOCK_DATA.sottoCollegamento.map((t) => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${state.sottoTipo === t ? 'border-primary-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                    {state.sottoTipo === t && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                                </div>
                                <input
                                    type="radio"
                                    name="sottoTipo"
                                    className="hidden"
                                    checked={state.sottoTipo === t}
                                    onChange={() => update('sottoTipo', t)}
                                />
                                <span className={`text-sm ${state.sottoTipo === t ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{t}</span>
                            </label>
                        ))}
                    </div>

                    {state.sottoTipo === 'Commessa' && (
                        <div className="max-w-md animate-fade-in-down">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Seleziona Commessa
                            </label>
                            <OrderSelector
                                orders={clientOrders}
                                value={state.commessa}
                                onChange={(val) => update('commessa', val)}
                                onSearch={getClientOrders}
                                onLoadMore={loadMoreOrders}
                                label="Commesse disponibili"
                                placeholder="Cerca commessa..."
                            />
                        </div>
                    )}

                    {state.sottoTipo === 'Opportunità' && (
                        <div className="max-w-md animate-fade-in-down">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Seleziona Opportunità
                            </label>
                            <OrderSelector
                                orders={clientOpportunitys}
                                value={state.opportunita}
                                onChange={(val) => update('opportunita', val)}
                                onSearch={getClientsOpportunitys}
                                onLoadMore={loadMoreOpportunitys}
                                label="Opportunità disponibili"
                                placeholder="Cerca opportunità..."
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
