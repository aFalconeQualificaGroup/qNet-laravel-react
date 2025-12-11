import React from 'react';
import { CollegatoAState, MOCK_DATA } from './types';
import { Select } from './UI';

interface Props {
    state: CollegatoAState;
    onChange: (newState: CollegatoAState) => void;
}

export const HierarchicalFilter: React.FC<Props> = ({ state, onChange }) => {

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
                        <Select
                            value={state.azienda}
                            onChange={(val) => update('azienda', val)}
                            options={[{ value: '', label: 'Seleziona...' }, ...MOCK_DATA.aziende.map(a => ({ value: a, label: a }))]}
                        />
                    </div>
                )}

                {/* Level 2: Contatto Selection */}
                {state.tipo === 'Contatto' && (
                    <div className="animate-fade-in-down">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Seleziona Contatto
                        </label>
                        <Select
                            value={state.contatto}
                            onChange={(val) => update('contatto', val)}
                            options={[{ value: '', label: 'Seleziona...' }, ...MOCK_DATA.contatti.map(c => ({ value: c, label: c }))]}
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
                            <Select
                                value={state.commessa}
                                onChange={(val) => update('commessa', val)}
                                options={[{ value: '', label: 'Seleziona...' }, ...MOCK_DATA.commesse.map(c => ({ value: c, label: c }))]}
                            />
                        </div>
                    )}

                    {state.sottoTipo === 'Opportunità' && (
                        <div className="max-w-md animate-fade-in-down">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Seleziona Opportunità
                            </label>
                            <Select
                                value={state.opportunita}
                                onChange={(val) => update('opportunita', val)}
                                options={[{ value: '', label: 'Seleziona...' }, ...MOCK_DATA.opportunita.map(c => ({ value: c, label: c }))]}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
