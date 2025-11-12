// ============================================================================
// CONSTANTS
// ============================================================================

export const WEEK_DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

export const WEEK_DAY_NAMES_FULL = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
];

export const MONTH_NAMES = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];

export const REPEAT_TYPES = [
  { value: 'none', label: 'Nessuna', icon: '🚫' },
  { value: 'daily', label: 'Giornaliera', icon: '📅' },
  { value: 'weekly', label: 'Settimanale', icon: '📊' },
  { value: 'monthly', label: 'Mensile', icon: '🗓️' },
  { value: 'yearly', label: 'Annuale', icon: '🎂' },
] as const;
