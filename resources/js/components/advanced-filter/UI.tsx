import React from 'react';

// --- Badges ---
export const Badge = ({ children, className = '', onClick }: { children?: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void }) => (
    <span
        onClick={onClick}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 cursor-pointer hover:bg-primary-200 transition-colors ${className}`}>
        {children}
    </span>
);

// --- Buttons ---
export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    className = '',
    icon,
    disabled
}: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm focus:ring-primary-500 border border-transparent",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm focus:ring-slate-400",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 focus:ring-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2 text-sm gap-2"
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
};

// --- Inputs ---
export const Select = ({ value, onChange, options, className = '' }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[], className?: string }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 bg-white border ${className}`}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

export const Input = ({ type = 'text', value, onChange, placeholder, className = '' }: { type?: string, value: string | number, onChange: (val: string) => void, placeholder?: string, className?: string }) => (
    <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border ${className}`}
    />
);

// --- Toggle Logic Switch ---
export const LogicSwitch = ({ value, onChange }: { value: 'AND' | 'OR', onChange: (val: 'AND' | 'OR') => void }) => (
    <div className="flex items-center bg-slate-100 rounded-lg p-1 w-max">
        <button
            onClick={() => onChange('AND')}
            className={`px-3 py-0.5 text-xs font-bold rounded-md transition-all ${value === 'AND' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
            AND
        </button>
        <button
            onClick={() => onChange('OR')}
            className={`px-3 py-0.5 text-xs font-bold rounded-md transition-all ${value === 'OR' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
            OR
        </button>
    </div>
);