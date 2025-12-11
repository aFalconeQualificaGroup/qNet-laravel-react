import React, { useState, useMemo } from 'react';
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
import { Button, Select, Input, Badge, LogicSwitch } from './components/UI';
import { HierarchicalFilter } from './components/HierarchicalFilter';

// --- Helper Functions ---
const createInitialFilters = (): FiltersMap => ({
    statoAttivita: { conditions: [{ id: '1', operator: 'equals', values: [], logic: null }] },
    assegnatario: { conditions: [{ id: '2', operator: 'in', values: [], logic: null }] },
    priorita: { conditions: [{ id: '3', operator: 'equals', values: [], logic: null }] },
    tipoAttivita: { conditions: [{ id: '4', operator: 'in', values: [], logic: null }] },
    statoCompletamento: { conditions: [{ id: '5', operator: 'equals', values: [], logic: null }] },
    osservatori: { conditions: [{ id: '6', operator: 'in', values: [], logic: null }] },
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
    filterState.conditions.forEach(c => {
        if (['is_empty', 'is_not_empty'].includes(c.operator)) {
            parts.push(c.operator === 'is_empty' ? 'Vuoto' : 'Non vuoto');
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
    const parts = [state.tipo];
    if (state.tipo === 'Azienda' && state.azienda) parts.push(state.azienda);
    if (state.tipo === 'Contatto' && state.contatto) parts.push(state.contatto);
    if (state.sottoTipo !== 'Nessuno') {
        parts.push(state.sottoTipo);
        if (state.sottoTipo === 'Commessa' && state.commessa) parts.push(state.commessa);
        if (state.sottoTipo === 'Opportunità' && state.opportunita) parts.push(state.opportunita);
    }
    return parts.join(' > ');
};

export default function App() {
    // --- State ---
    // Changed default activeTab to 'saved'
    const [activeTab, setActiveTab] = useState<'filters' | 'saved' | 'favorites'>('saved');
    const [searchText, setSearchText] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [filters, setFilters] = useState<FiltersMap>(createInitialFilters());
    const [collegatoA, setCollegatoA] = useState<CollegatoAState>(initialCollegatoA);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ statoAttivita: true });

    // Saved & Favorites
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Save Modal State
    const [newFilterName, setNewFilterName] = useState('');
    const [newFilterDescription, setNewFilterDescription] = useState('');
    const [saveAsFavorite, setSaveAsFavorite] = useState(false);

    // --- Actions ---

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const updateCondition = (filterKey: string, conditionIndex: number, updates: Partial<Condition>) => {
        setFilters(prev => {
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
        setFilters(prev => {
            const currentConditions = prev[filterKey].conditions;
            // Add AND logic to the previous last condition
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
        setFilters(prev => {
            const newConditions = prev[filterKey].conditions.filter((_, i) => i !== index);
            if (newConditions.length > 0) {
                // Ensure the last one has no logic
                newConditions[newConditions.length - 1].logic = null;
            } else {
                // Should probably reset to initial state if all removed, but for now allow empty
                // or recreate first condition
            }
            return { ...prev, [filterKey]: { conditions: newConditions } };
        });
    };

    const toggleMultiSelect = (filterKey: string, conditionIndex: number, value: string) => {
        const currentValues = filters[filterKey].conditions[conditionIndex].values;
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
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
        setActiveTab('filters');
    };

    const saveFilter = () => {
        if (!newFilterName) return;
        const newId = Date.now();
        const newFilter: SavedFilter = {
            id: newId,
            name: newFilterName,
            description: newFilterDescription,
            filters: JSON.parse(JSON.stringify(filters)),
            collegatoA: { ...collegatoA },
            searchText,
            createdAt: new Date().toISOString()
        };
        setSavedFilters(prev => [...prev, newFilter]);
        if (saveAsFavorite) {
            setFavorites(prev => [...prev, newId]);
        }
        setShowSaveModal(false);
        setNewFilterName('');
        setNewFilterDescription('');
        setSaveAsFavorite(false);
    };

    const loadFilter = (filter: SavedFilter) => {
        setFilters(filter.filters);
        setCollegatoA(filter.collegatoA);
        setSearchText(filter.searchText);
        setActiveTab('filters');
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
    };

    // --- Render Logic ---

    const getActiveCount = useMemo(() => {
        let count = 0;
        Object.values(filters).forEach((f) => {
            const filterState = f as FilterState;
            filterState.conditions.forEach(c => {
                if (['is_empty', 'is_not_empty'].includes(c.operator)) count++;
                else if (c.values.length > 0 && c.values[0] !== '') count++;
            });
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

        // Data Source for MultiSelect
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
                        <Select
                            value={condition.operator}
                            onChange={(val) => updateCondition(filterKey, index, { operator: val })}
                            options={options}
                        />
                    </div>

                    {needsValues && (
                        <div className="flex-1">
                            {/* Date Handling */}
                            {isDate && condition.operator === 'between' ? (
                                <div className="flex gap-2">
                                    <Input type="date" value={condition.values[0]} onChange={(v) => updateCondition(filterKey, index, { values: [v, condition.values[1]] })} />
                                    <Input type="date" value={condition.values[1]} onChange={(v) => updateCondition(filterKey, index, { values: [condition.values[0], v] })} />
                                </div>
                            ) : isDate ? (
                                <Input type="date" value={condition.values[0]} onChange={(v) => updateCondition(filterKey, index, { values: [v] })} />
                            ) : (
                                /* Standard Inputs */
                                isMulti ? (
                                    <div className="border border-slate-300 rounded-md max-h-40 overflow-y-auto bg-white p-2 space-y-1 shadow-inner custom-scrollbar">
                                        {sourceData.map(opt => (
                                            <label key={opt} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={condition.values.includes(opt)}
                                                    onChange={() => toggleMultiSelect(filterKey, index, opt)}
                                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-slate-700">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    /* Single Select / Radio Simulation */
                                    <div className="flex flex-wrap gap-2">
                                        {sourceData.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => updateCondition(filterKey, index, { values: [opt] })}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                                    condition.values[0] === opt
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {opt}
                                            </button>
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
        <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">

            {/* --- HEADER --- */}
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col gap-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                        <Filter size={20} />
                    </div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Cerca per parola chiave, cliente o ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm"
                        />
                    </div>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                </div>

                {!isCollapsed && (
                    <div className="flex items-center justify-between">
                         <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
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
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" icon={<Zap size={14} />}>Reset</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar relative">
                {!isCollapsed && (
                    <>
                    {activeTab === 'filters' && (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Summary Chips Area with SAVE BUTTON */}
                            {getActiveCount > 0 && (
                                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Riepilogo:</div>
                                        {collegatoA.tipo !== 'Nessuno' && (
                                            <Badge onClick={() => toggleSection('collegatoA')}>
                                                {getHierarchicalPreview(collegatoA)}
                                            </Badge>
                                        )}
                                        {Object.entries(filters).map(([key, f]) => {
                                            const filterState = f as FilterState;
                                            const preview = getFilterPreview(filterState);
                                            if (!preview) return null;
                                            return (
                                                <React.Fragment key={key}>
                                                    <Badge onClick={() => toggleSection(key)} className="bg-white border border-primary-200 shadow-sm text-primary-700">
                                                        <span className="font-bold mr-1">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {preview}
                                                    </Badge>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                    <div className="pl-4 border-l border-slate-200 ml-4">
                                         <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowSaveModal(true)}
                                            icon={<Save size={16} />}
                                            className="text-primary-600 hover:bg-primary-50 whitespace-nowrap"
                                        >
                                            Salva Filtro
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Section: Collegato A (Hierarchical) */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleSection('collegatoA')}
                                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${collegatoA.tipo !== 'Nessuno' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <span className="font-bold text-sm">#</span>
                                        </div>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="font-semibold text-slate-800">Collegato A</span>
                                            {collegatoA.tipo !== 'Nessuno' && (
                                                <span className="text-xs text-primary-600 font-medium truncate max-w-[300px]">
                                                    {getHierarchicalPreview(collegatoA)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {expandedSections['collegatoA'] ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                </button>

                                {expandedSections['collegatoA'] && (
                                    <div className="p-4 border-t border-slate-100">
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
                                    <div key={key} className={`bg-white rounded-xl border transition-all duration-200 ${isActive ? 'border-primary-200 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                                        <button
                                            onClick={() => toggleSection(key)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-t-xl transition-colors"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <span className="font-bold text-sm">{key.substring(0,2).toUpperCase()}</span>
                                                </div>
                                                <div className="flex flex-col items-start min-w-0">
                                                    <span className={`font-semibold ${isActive ? 'text-primary-900' : 'text-slate-800'}`}>{label}</span>
                                                    {isActive && (
                                                        <span className="text-xs text-primary-600 font-medium truncate max-w-[500px] block">
                                                            {preview}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSections[key] ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                        </button>

                                        {expandedSections[key] && (
                                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl space-y-4">
                                                {filterState.conditions.map((condition, index) => (
                                                    <div key={condition.id} className="relative group">
                                                        {/* Logic Connector */}
                                                        {index > 0 && (
                                                            <div className="flex justify-center my-3 relative">
                                                                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10"></div>
                                                                <LogicSwitch
                                                                    value={filterState.conditions[index-1].logic || 'AND'}
                                                                    onChange={(val) => {
                                                                        setFilters(prev => {
                                                                            const nc = [...prev[key].conditions];
                                                                            nc[index-1].logic = val;
                                                                            return { ...prev, [key]: { conditions: nc } };
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm group-hover:border-primary-200 transition-colors">
                                                            <div className="flex-1">
                                                                {renderConditionInput(key, condition, index)}
                                                            </div>
                                                            {filterState.conditions.length > 1 && (
                                                                <button
                                                                    onClick={() => removeCondition(key, index)}
                                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => addCondition(key)}
                                                    className="w-full border border-dashed border-slate-300 hover:border-primary-400 text-slate-500 hover:text-primary-600"
                                                    icon={<Plus size={14} />}
                                                >
                                                    Aggiungi Condizione
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="max-w-5xl mx-auto space-y-4">
                            {/* Create New Header */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">I tuoi Filtri Salvati</h3>
                                    <p className="text-sm text-slate-500">Seleziona un filtro esistente o creane uno nuovo.</p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateNew}
                                    icon={<PlusCircle size={18} />}
                                    className="shadow-lg shadow-primary-500/20"
                                >
                                    Crea Nuovo Filtro
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedFilters.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                        <Save size={48} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium">Nessun filtro salvato</p>
                                        <p className="text-sm mb-4">Configura i tuoi filtri e salvali per riutilizzarli.</p>
                                        <Button variant="secondary" onClick={handleCreateNew}>Crea il primo filtro</Button>
                                    </div>
                                ) : (
                                    savedFilters.map(filter => (
                                        <div key={filter.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-800 text-lg">{filter.name}</h3>
                                                <button onClick={() => toggleFavorite(filter.id)} className={`${favorites.includes(filter.id) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}>
                                                    <Star size={18} fill={favorites.includes(filter.id) ? "currentColor" : "none"} />
                                                </button>
                                            </div>

                                            {/* Description display */}
                                            {filter.description && (
                                                <div className="flex items-start gap-1.5 text-slate-500 mb-3 text-sm bg-slate-50 p-2 rounded-md">
                                                    <Info size={14} className="mt-0.5 shrink-0 opacity-70" />
                                                    <span className="italic leading-tight">{filter.description}</span>
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1 mt-auto pt-2">
                                                <History size={12} /> Creato il {new Date(filter.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button variant="primary" size="sm" className="flex-1" onClick={() => loadFilter(filter)}>Applica</Button>
                                                <Button variant="danger" size="sm" onClick={() => setSavedFilters(prev => prev.filter(f => f.id !== filter.id))} icon={<Trash2 size={14} />} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {savedFilters.filter(f => favorites.includes(f.id)).length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                                    <Star size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Nessun preferito</p>
                                </div>
                            ) : (
                                savedFilters.filter(f => favorites.includes(f.id)).map(filter => (
                                    <div key={filter.id} className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-800">{filter.name}</h3>
                                            <Star size={18} className="text-amber-400" fill="currentColor" />
                                        </div>
                                        {filter.description && (
                                            <p className="text-sm text-slate-600 mb-3 italic opacity-80">{filter.description}</p>
                                        )}
                                        <Button variant="primary" size="sm" className="w-full mt-4" onClick={() => loadFilter(filter)}>Applica</Button>
                                    </div>
                                ))
                            )}
                         </div>
                    )}
                    </>
                )}
            </div>

            {/* --- FOOTER --- */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={resetAll}>Reset</Button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 mr-2">{getActiveCount} criteri selezionati</span>
                    <Button variant="secondary">Annulla</Button>
                    <Button
                        variant="primary"
                        onClick={() => alert('Filtri applicati!\n' + JSON.stringify(filters, null, 2))}
                        className="shadow-lg shadow-primary-500/20"
                        icon={<CheckCircle2 size={18} />}
                        disabled={getActiveCount === 0}
                    >
                        Applica Filtri
                    </Button>
                </div>
            </div>

            {/* --- MODAL --- */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Salva Filtro</h2>
                            <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome del filtro</label>
                                <Input value={newFilterName} onChange={setNewFilterName} placeholder="Es. Task urgenti Mario" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descrizione (opzionale)</label>
                                <textarea
                                    value={newFilterDescription}
                                    onChange={(e) => setNewFilterDescription(e.target.value)}
                                    placeholder="Aggiungi dettagli..."
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border resize-none h-20"
                                />
                            </div>

                            {/* Favorite Toggle */}
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${saveAsFavorite ? 'bg-amber-400 border-amber-400' : 'border-slate-300 bg-white'}`}>
                                    {saveAsFavorite && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={saveAsFavorite} onChange={() => setSaveAsFavorite(!saveAsFavorite)} />
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Star size={16} className={saveAsFavorite ? 'text-amber-400' : 'text-slate-400'} fill={saveAsFavorite ? "currentColor" : "none"} />
                                    Aggiungi ai Preferiti
                                </div>
                            </label>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-200">
                                <p className="font-medium mb-1">Riepilogo criteri:</p>
                                <ul className="list-disc pl-4 space-y-1 text-xs">
                                    {collegatoA.tipo !== 'Nessuno' && <li>Collegato A: {getHierarchicalPreview(collegatoA)}</li>}
                                    {Object.values(filters).map((f, i) => {
                                        const prev = getFilterPreview(f as FilterState);
                                        return prev ? <li key={i}>{Object.keys(filters)[i]}: {prev}</li> : null;
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="ghost" onClick={() => setShowSaveModal(false)}>Annulla</Button>
                            <Button variant="primary" onClick={saveFilter} disabled={!newFilterName}>Salva Filtro</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}