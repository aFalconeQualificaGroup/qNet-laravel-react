import React, { useState, useMemo, useEffect } from 'react';
import { 
    Filter, 
    Search, 
    ChevronDown, 
    ChevronUp, 
    X, 
    Plus, 
    Save, 
    Trash2, 
    Star, 
    History,
    Zap,
    LayoutGrid,
    CheckCircle2,
    Heart,
    Info,
    PlusCircle
} from 'lucide-react';
import { OPERATORS, MOCK_DATA, FilterState, FiltersMap, Condition, CollegatoAState, SavedFilter, LogicType } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HierarchicalFilter } from './HierarchicalFilter';
import { usePage, router } from '@inertiajs/react';
import { MultiUserDropdown } from '../generatedComponents/task-generator/multi-user-dropdown';
import { toast } from 'sonner';

// --- Helper Functions ---
const createInitialFilters = (): FiltersMap => ({
    statoAttivita: { conditions: [{ id: '1', operator: 'equals', values: [], logic: null }] },
    assegnatario: { conditions: [{ id: '2', operator: 'in', values: [], logic: null, users: [] }] },
    priorita: { conditions: [{ id: '3', operator: 'equals', values: [], logic: null }] },
    tipoAttivita: { conditions: [{ id: '4', operator: 'in', values: [], logic: null }] },
    statoCompletamento: { conditions: [{ id: '5', operator: 'equals', values: [], logic: null }] },
    osservatori: { conditions: [{ id: '6', operator: 'in', values: [], logic: null, users: [] }] },
    dataScadenza: { conditions: [{ id: '7', operator: 'between', values: ['', ''], logic: null }] },
    dataInizio: { conditions: [{ id: '8', operator: 'between', values: ['', ''], logic: null }] },
});

const initialCollegatoA: CollegatoAState = {
    tipo: 'Nessuno',
    azienda: '',
    contatto: '',
    sottoTipo: 'Nessuno',
    commessa: '',
    opportunita: ''
};

// Helper to generate preview text for a filter state
const getFilterPreview = (filterState: FilterState): string | null => {
    const parts: string[] = [];
    filterState.conditions.forEach((c: Condition) => {
        if (['is_empty', 'is_not_empty'].includes(c.operator)) {
            parts.push(c.operator === 'is_empty' ? 'Vuoto' : 'Non vuoto');
        } else if (c.users && c.users.length > 0) {
            // Per assegnatari e osservatori mostra i nomi degli utenti
            parts.push(c.users.map(u => u.name).join(', '));
        } else if (c.values.length > 0 && c.values[0] !== '') {
            if (c.operator === 'between' && c.values.length === 2) {
                parts.push(`${c.values[0]} → ${c.values[1]}`);
            } else {
                parts.push(c.values.join(', '));
            }
        }
    });
    return parts.length > 0 ? parts.join(' + ') : null;
};

// Helper for Hierarchical preview
const getHierarchicalPreview = (state: CollegatoAState): string | null => {
    if (state.tipo === 'Nessuno') return null;
    const parts: string[] = [state.tipo];
    if (state.tipo === 'Azienda' && state.azienda) parts.push(state.azienda);
    if (state.tipo === 'Contatto' && state.contatto) parts.push(state.contatto);
    if (state.sottoTipo !== 'Nessuno') {
        parts.push(state.sottoTipo);
        if (state.sottoTipo === 'Commessa' && state.commessa) parts.push(state.commessa);
        if (state.sottoTipo === 'Opportunità' && state.opportunita) parts.push(state.opportunita);
    }
    return parts.join(' > ');
};

// LogicSwitch component using shadcn ToggleGroup
const LogicSwitch = ({ value, onChange }: { value: 'AND' | 'OR', onChange: (val: 'AND' | 'OR') => void }) => (
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as 'AND' | 'OR')} size="sm">
        <ToggleGroupItem value="AND" aria-label="AND" className="h-6 px-2 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            AND
        </ToggleGroupItem>
        <ToggleGroupItem value="OR" aria-label="OR" className="h-6 px-2 text-xs data-[state=on]:bg-orange-500 data-[state=on]:text-white">
            OR
        </ToggleGroupItem>
    </ToggleGroup>
);

export default function AdvancedFilters() {
    // --- Inertia Props ---
    const { props } = usePage<{ 
        assegnatariForAdvancedFilter?: { id: number; name: string }[];
        osservatoriForAdvancedFilter?: { id: number; name: string }[];
        userSavedFilters?: SavedFilter[];
        flash?: { 
            success?: string; 
            error?: string; 
            warning?: string; 
        };
    }>();
    const assegnatari = props.assegnatariForAdvancedFilter || [];
    const osservatori = props.osservatoriForAdvancedFilter || [];

    // --- State ---
    const [activeTab, setActiveTab] = useState<'filters' | 'saved' | 'favorites'>('saved');
    const [searchText, setSearchText] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [filters, setFilters] = useState<FiltersMap>(createInitialFilters());
    const [collegatoA, setCollegatoA] = useState<CollegatoAState>(initialCollegatoA);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    
    /* Gestione degli errori */
    useEffect(() => {
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.warning) {
            toast.warning(props.flash.warning);
        }
    }, [props.flash]);

    /* Recupero filtri utente */
    useEffect(() => {
        router.reload({
            only: ['userSavedFilters'],
        });    
    }, []);

    /* Salvataggio filtri nello stato locale */
    useEffect(() => {
         if (props.userSavedFilters) {
            setSavedFilters(props.userSavedFilters);
            
            // Popola i preferiti con i filtri che hanno isFavorite: true
            const favoriteIds = props.userSavedFilters
                .filter(filter => filter.isFavorite === true)
                .map(filter => filter.id);
            setFavorites(favoriteIds);
        }
    }, [props.userSavedFilters]);

    // --- Funzioni per caricare utenti ---
    const loadAssegnatari = (search: string = '') => {
        if (search.length >= 3 || search.length === 0) {
            router.reload({
                only: ['assegnatariForAdvancedFilter'],
                data: { search },
            });
        }
    };
    
    const loadOsservatori = (search: string = '') => {
        if (search.length >= 3 || search.length === 0) {
            router.reload({
                only: ['osservatoriForAdvancedFilter'],
                data: { search },
            });
        }
    };
    
    // Saved & Favorites
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Save Modal State
    const [newFilterName, setNewFilterName] = useState('');
    const [newFilterDescription, setNewFilterDescription] = useState('');
    const [saveAsFavorite, setSaveAsFavorite] = useState(false);
    const [editingFilterId, setEditingFilterId] = useState<number | null>(null);


    
       
    // --- Actions ---

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const updateCondition = (filterKey: string, conditionIndex: number, updates: Partial<Condition>) => {
        setFilters((prev: FiltersMap) => {
            const newConditions = [...prev[filterKey].conditions];
            newConditions[conditionIndex] = { ...newConditions[conditionIndex], ...updates };

            // Auto-clear values if operator changes to empty/not empty
            if (updates.operator && ['is_empty', 'is_not_empty'].includes(updates.operator)) {
                newConditions[conditionIndex].values = [];
            }

            return { ...prev, [filterKey]: { conditions: newConditions } };
        });
    };

    const addCondition = (filterKey: string) => {
        setFilters((prev: FiltersMap) => {
            const currentConditions = prev[filterKey].conditions;
            const lastIndex = currentConditions.length - 1;
            const updatedPrevious = [...currentConditions];
            updatedPrevious[lastIndex] = { ...updatedPrevious[lastIndex], logic: 'AND' };

            const newCondition: Condition = {
                id: Math.random().toString(36).substr(2, 9),
                operator: filterKey.includes('data') ? 'between' : 'equals',
                values: filterKey.includes('data') ? ['', ''] : [],
                logic: null
            };

            return { ...prev, [filterKey]: { conditions: [...updatedPrevious, newCondition] } };
        });
    };

    const removeCondition = (filterKey: string, index: number) => {
        setFilters((prev: FiltersMap) => {
            const newConditions = prev[filterKey].conditions.filter((_: Condition, i: number) => i !== index);
            if (newConditions.length > 0) {
                newConditions[newConditions.length - 1].logic = null;
            }
            return { ...prev, [filterKey]: { conditions: newConditions } };
        });
    };

    const toggleMultiSelect = (filterKey: string, conditionIndex: number, value: string) => {
        const currentValues = filters[filterKey].conditions[conditionIndex].values;
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v: string) => v !== value)
            : [...currentValues, value];
        updateCondition(filterKey, conditionIndex, { values: newValues });
    };

    const resetAll = () => {
        setFilters(createInitialFilters());
        setCollegatoA(initialCollegatoA);
        setSearchText('');
    };

    const handleCreateNew = () => {
        resetAll();
        setEditingFilterId(null);
        setActiveTab('filters');
    };

    const saveFilter = () => {
        if (!newFilterName) return;
        
        const filterData: {
            filters: string;
            collegatoA: string;
            searchText: string;
            name: string;
            description: string;
            is_favorite: boolean;
            id?: number;
        } = {
            filters: JSON.stringify(filters),
            collegatoA: JSON.stringify(collegatoA),
            searchText: searchText,
            name: newFilterName,
            description: newFilterDescription,
            is_favorite: saveAsFavorite,
        };

        // Se stiamo modificando un filtro esistente, aggiungi l'ID
        if (editingFilterId !== null) {
            filterData.id = editingFilterId;
        }

        router.post('/tasks/save-user-tasks-filter', filterData, {
            onSuccess: () => {
                // Ricarica i filtri salvati
                router.reload({ only: ['userSavedFilters'] });
            }
        });

        setShowSaveModal(false);
        setNewFilterName('');
        setNewFilterDescription('');
        setSaveAsFavorite(false);
        setEditingFilterId(null);
    };

    const loadFilter = (filter: SavedFilter) => {
        // Parse i dati se arrivano come stringhe JSON dal backend
        const parsedFilters = typeof filter.filters === 'string' 
            ? JSON.parse(filter.filters) 
            : filter.filters;
        const parsedCollegatoA = typeof filter.collegatoA === 'string' 
            ? JSON.parse(filter.collegatoA) 
            : filter.collegatoA;
            
        setFilters(parsedFilters);
        setCollegatoA(parsedCollegatoA);
        setSearchText(filter.searchText);
        
        // Salva l'ID e i dati del filtro per la modalità modifica
        setEditingFilterId(filter.id);
        setNewFilterName(filter.name);
        setNewFilterDescription(filter.description);
        setSaveAsFavorite(filter.isFavorite || false);
        
        setActiveTab('filters');
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
        router.post(`/tasks/update-favorite-filter-status/${id}`, {});
    };

    // --- Render Logic ---

    const getActiveCount = useMemo(() => {
        let count = 0;
        Object.values(filters).forEach((f) => {
            const filterState = f as FilterState;
            if (filterState && filterState.conditions) {
                filterState.conditions.forEach((c: Condition) => {
                    if (['is_empty', 'is_not_empty'].includes(c.operator)) count++;
                    else if (c.users && c.users.length > 0) count++;
                    else if (c.values.length > 0 && c.values[0] !== '') count++;
                });
            }
        });
        if (collegatoA.tipo !== 'Nessuno') count++;
        if (searchText) count++;
        return count;
    }, [filters, collegatoA, searchText]);

    // Reusable Condition Renderer
    const renderConditionInput = (filterKey: string, condition: Condition, index: number) => {
        const isDate = filterKey.includes('data');
        const isMulti = ['assegnatario', 'osservatori', 'tipoAttivita'].includes(filterKey);
        const options = isDate ? OPERATORS.date : (isMulti ? OPERATORS.multiselect : OPERATORS.select);

        let sourceData: string[] = [];
        if (filterKey === 'assegnatario' || filterKey === 'osservatori') sourceData = MOCK_DATA.utenti;
        else if (filterKey === 'tipoAttivita') sourceData = MOCK_DATA.tipiAttivita;
        else if (filterKey === 'priorita') sourceData = MOCK_DATA.priorita;
        else if (filterKey === 'statoAttivita') sourceData = MOCK_DATA.stati;
        else if (filterKey === 'statoCompletamento') sourceData = MOCK_DATA.statoCompletamento;

        const needsValues = !['is_empty', 'is_not_empty'].includes(condition.operator);

        return (
            <div className="flex flex-col gap-3 w-full animate-fade-in">
                <div className="flex gap-2 items-center">
                    <div className="w-1/3 min-w-[140px]">
                        <Select value={condition.operator} onValueChange={(val) => updateCondition(filterKey, index, { operator: val })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt: {value: string, label: string}) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {needsValues && (
                        <div className="flex-1">
                            {isDate && condition.operator === 'between' ? (
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={condition.values[0]}
                                        onChange={(e) => updateCondition(filterKey, index, { values: [e.target.value, condition.values[1]] })}
                                    />
                                    <Input
                                        type="date"
                                        value={condition.values[1]}
                                        onChange={(e) => updateCondition(filterKey, index, { values: [condition.values[0], e.target.value] })}
                                    />
                                </div>
                            ) : isDate ? (
                                <Input
                                    type="date"
                                    value={condition.values[0]}
                                    onChange={(e) => updateCondition(filterKey, index, { values: [e.target.value] })}
                                />
                            ) : (
                                (filterKey === 'assegnatario' || filterKey === 'osservatori') ? (
                                    <MultiUserDropdown
                                        users={filterKey === 'assegnatario' ? assegnatari : osservatori}
                                        value={(condition as any).users || []}
                                        onChange={(users) => updateCondition(filterKey, index, { 
                                            users,
                                            values: users.map(u => String(u.id))
                                        })}
                                        onFilter={filterKey === 'assegnatario' ? loadAssegnatari : loadOsservatori}
                                        title={filterKey === 'assegnatario' ? 'Seleziona assegnatari' : 'Seleziona osservatori'}
                                        placeholder="Cerca utente..."
                                    />
                                ) : isMulti ? (
                                    <div className="border border-input rounded-md max-h-40 overflow-y-auto bg-background p-2 space-y-1">
                                        {sourceData.map(opt => (
                                            <label key={opt} className="flex items-center gap-2 p-1.5 hover:bg-accent rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={condition.values.includes(opt)}
                                                    onChange={() => toggleMultiSelect(filterKey, index, opt)}
                                                    className="rounded border-input"
                                                />
                                                <span className="text-sm">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {sourceData.map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${condition.values[0] === opt ? 'border-primary' : 'border-input group-hover:border-primary/50'}`}>
                                                    {condition.values[0] === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`${filterKey}-${index}`}
                                                    className="hidden"
                                                    checked={condition.values[0] === opt}
                                                    onChange={() => updateCondition(filterKey, index, { values: [opt] })}
                                                />
                                                <span className={`text-sm ${condition.values[0] === opt ? 'font-medium' : 'text-muted-foreground'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-background rounded-lg shadow-lg flex flex-col overflow-hidden border">

            {/* --- HEADER --- */}
            <div className="p-4 border-b bg-background flex flex-col gap-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Filter size={20} />
                    </div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Cerca per parola chiave, cliente o ID..."
                            className="w-full pl-10"
                        />
                    </div>
                    <Button onClick={() => setIsCollapsed(!isCollapsed)} variant="ghost" size="icon" className="transition-transform duration-300">
                        {isCollapsed ? <ChevronDown size={20} className="transition-transform duration-300" /> : <ChevronUp size={20} className="transition-transform duration-300" />}
                    </Button>
                </div>

                {!isCollapsed && (
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1 bg-muted p-1 rounded-lg">
                            {[
                                { id: 'saved', label: 'Salvati', icon: <History size={16} />, count: savedFilters.length },
                                { id: 'filters', label: 'Nuovo / Attuale', icon: <LayoutGrid size={16} /> },
                                { id: 'favorites', label: 'Preferiti', icon: <Star size={16} />, count: favorites.length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={resetAll}>
                                <Zap size={14} className="mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- CONTENT --- */}
            {!isCollapsed && (
            <>
            <div className="bg-muted/30 p-6 relative animate-in fade-in slide-in-from-top-2 duration-300">
                    {activeTab === 'filters' && (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Summary Chips Area with SAVE BUTTON */}
                            {getActiveCount > 0 && (
                                <div className="flex items-center justify-between mb-6 p-3 bg-background rounded-xl border shadow-sm">
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {getHierarchicalPreview(collegatoA) && (
                                            <Badge variant="secondary" className="gap-1">
                                                {getHierarchicalPreview(collegatoA)}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                                    onClick={() => setCollegatoA(initialCollegatoA)}
                                                />
                                            </Badge>
                                        )}
                                        {Object.entries(filters).map(([key, f]) => {
                                            const preview = getFilterPreview(f as FilterState);
                                            if (!preview) return null;
                                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            return (
                                                <Badge key={key} variant="secondary" className="gap-1">
                                                    <strong>{label}:</strong> {preview}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                                                        onClick={() => setFilters((prev: FiltersMap) => ({ ...prev, [key]: { conditions: [{ id: Date.now().toString(), operator: 'equals', values: [], logic: null }] } }))}
                                                    />
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                    <Button variant="default" size="sm" onClick={() => setShowSaveModal(true)}>
                                        <Save size={14} className="mr-2" />
                                        {editingFilterId !== null ? 'Aggiorna' : 'Salva'}
                                    </Button>
                                </div>
                            )}

                            {/* Section: Collegato A (Hierarchical) */}
                            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleSection('collegatoA')}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${getHierarchicalPreview(collegatoA) ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                        <span className="font-semibold text-sm">Collegato A</span>
                                        {getHierarchicalPreview(collegatoA) && (
                                            <Badge variant="secondary" className="text-xs">{getHierarchicalPreview(collegatoA)}</Badge>
                                        )}
                                    </div>
                                    {expandedSections['collegatoA'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {expandedSections['collegatoA'] && (
                                    <div className="p-4 border-t">
                                        <HierarchicalFilter state={collegatoA} onChange={setCollegatoA} />
                                    </div>
                                )}
                            </div>

                            {/* Section: Standard Filters */}
                            {Object.entries(filters).map(([key, f]) => {
                                const filterState = f as FilterState;
                                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                const preview = getFilterPreview(filterState);
                                const isActive = !!preview;

                                return (
                                    <div key={key} className="bg-background rounded-xl border shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(key)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                                <span className="font-semibold text-sm">{label}</span>
                                                {preview && (
                                                    <Badge variant="secondary" className="text-xs">{preview}</Badge>
                                                )}
                                            </div>
                                            {expandedSections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        {expandedSections[key] && (
                                            <div className="p-4 border-t space-y-3">
                                                {filterState.conditions.map((condition: Condition, index: number) => (
                                                    <div key={condition.id} className="space-y-2">
                                                        <div className="flex gap-2 items-start">
                                                            <div className="flex-1">
                                                                {renderConditionInput(key, condition, index)}
                                                            </div>
                                                            {filterState.conditions.length > 1 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeCondition(key, index)}
                                                                    className="mt-1"
                                                                >
                                                                    <X size={16} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {condition.logic && index < filterState.conditions.length - 1 && (
                                                            <div className="flex items-center gap-2 my-2">
                                                                <div className="h-px flex-1 bg-border" />
                                                                <LogicSwitch
                                                                    value={condition.logic}
                                                                    onChange={(val) => updateCondition(key, index, { logic: val })}
                                                                />
                                                                <div className="h-px flex-1 bg-border" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <Button variant="outline" size="sm" onClick={() => addCondition(key)} className="w-full">
                                                    <Plus size={14} className="mr-2" />
                                                    Aggiungi Condizione
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="max-w-5xl mx-auto space-y-4">
                            {/* Create New Header */}
                            <div className="bg-background p-4 rounded-xl border shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <PlusCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Crea Nuovo Filtro</h3>
                                        <p className="text-sm text-muted-foreground">Inizia con un filtro personalizzato</p>
                                    </div>
                                </div>
                                <Button variant="default" onClick={handleCreateNew}>
                                    <Plus size={16} className="mr-2" />
                                    Nuovo
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedFilters.map(filter => (
                                    <div key={filter.id} className="bg-background p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-sm flex-1">{filter.name}</h3>
                                            <button onClick={() => toggleFavorite(filter.id)} className="text-muted-foreground hover:text-primary">
                                                <Star size={16} className={favorites.includes(filter.id) ? 'fill-primary text-primary' : ''} />
                                            </button>
                                        </div>
                                        {filter.description && (
                                            <p className="text-xs text-muted-foreground mb-3">{filter.description}</p>
                                        )}
                                        <div className="text-xs text-muted-foreground mb-3">
                                            {new Date(filter.createdAt).toLocaleDateString()}
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => loadFilter(filter)} className="w-full">
                                            Carica
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {savedFilters.filter(f => favorites.includes(f.id)).length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <Star size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Nessun preferito</p>
                                    <p className="text-sm">Aggiungi filtri ai preferiti per accedervi rapidamente</p>
                                </div>
                            ) : (
                                savedFilters.filter(f => favorites.includes(f.id)).map(filter => (
                                    <div key={filter.id} className="bg-background p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-sm flex-1">{filter.name}</h3>
                                            <Star size={16} className="fill-primary text-primary" />
                                        </div>
                                        {filter.description && <p className="text-xs text-muted-foreground mb-3">{filter.description}</p>}
                                        <Button variant="outline" size="sm" onClick={() => loadFilter(filter)} className="w-full">Carica</Button>
                                    </div>
                                ))
                            )}
                         </div>
                    )}
            </div>

            {/* --- FOOTER --- */}
            <div className="p-4 bg-background border-t flex justify-between items-center z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={resetAll}>Reset</Button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground mr-2">{getActiveCount} criteri selezionati</span>
                    <Button variant="secondary">Annulla</Button>
                    <Button
                        variant="default"
                        onClick={() => alert('Filtri applicati!\n' + JSON.stringify(filters, null, 2))}
                        disabled={getActiveCount === 0}
                    >
                        <CheckCircle2 size={18} className="mr-2" />
                        Applica Filtri
                    </Button>
                </div>
            </div>
            </>
            )}

            {/* --- MODAL --- */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingFilterId !== null ? 'Aggiorna Filtro' : 'Salva Filtro'}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowSaveModal(false)}>
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Nome Filtro</label>
                                <Input
                                    value={newFilterName}
                                    onChange={(e) => setNewFilterName(e.target.value)}
                                    placeholder="Es. Task urgenti Mario"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Descrizione (opzionale)</label>
                                <textarea
                                    value={newFilterDescription}
                                    onChange={(e) => setNewFilterDescription(e.target.value)}
                                    placeholder="Aggiungi dettagli..."
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none h-20"
                                />
                            </div>

                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={saveAsFavorite}
                                    onChange={() => setSaveAsFavorite(!saveAsFavorite)}
                                    className="rounded border-input"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className={saveAsFavorite ? 'fill-primary text-primary' : ''} />
                                        <span className="font-medium text-sm">Aggiungi ai preferiti</span>
                                    </div>
                                </div>
                            </label>

                            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground border">
                                <div className="flex items-start gap-2">
                                    <Info size={16} className="mt-0.5 shrink-0" />
                                    <div>
                                        <strong className="text-foreground">Filtri Salvati:</strong> {getActiveCount} criteri attivi
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="ghost" onClick={() => setShowSaveModal(false)}>Annulla</Button>
                            <Button variant="default" onClick={saveFilter} disabled={!newFilterName}>
                                {editingFilterId !== null ? 'Aggiorna Filtro' : 'Salva Filtro'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
