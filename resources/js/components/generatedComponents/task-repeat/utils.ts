import type { TaskRepeatConfig } from './types';
import { WEEK_DAY_NAMES_FULL, MONTH_NAMES } from './constants';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate next occurrences based on configuration
 */
export const calculateOccurrences = (
  config: Partial<TaskRepeatConfig>
): Date[] => {
  const {
    repeatType = 'none',
    interval = 1,
    startDate,
    endType = 'never',
    endDate,
    occurrences = 10,
    workDaysOnly = false,
  } = config;

  if (repeatType === 'none' || !startDate) return [];

  const occurrencesList: Date[] = [];
  const start = new Date(startDate);
  const end = endType === 'date' && endDate ? new Date(endDate) : null;
  const maxOccurrences = endType === 'occurrences' ? occurrences : 100;

  let currentDate = new Date(start);
  let count = 0;

  while (count < maxOccurrences && count < 365) {
    if (end && currentDate > end) break;

    let shouldAdd = true;

    if (workDaysOnly) {
      const day = currentDate.getDay();
      if (day === 0 || day === 6) shouldAdd = false;
    }

    if (shouldAdd) {
      occurrencesList.push(new Date(currentDate));
      count++;
    }

    switch (repeatType) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * interval);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
    }
  }

  return occurrencesList;
};

/**
 * Get human-readable summary
 */
export const getRepeatSummary = (config: Partial<TaskRepeatConfig>): string => {
  const {
    repeatType = 'none',
    interval = 1,
    endType = 'never',
    endDate,
    occurrences = 10,
    weekDays = [],
    monthDay = 1,
    yearMonth = 0,
  } = config;

  if (repeatType === 'none') return 'Nessuna ripetizione';

  const intervalText = interval === 1 ? '' : `ogni ${interval} `;
  let summary = '';

  switch (repeatType) {
    case 'daily':
      summary = `${intervalText}${interval === 1 ? 'Ogni giorno' : 'giorni'}`;
      break;
    case 'weekly':
      const days = weekDays.map((d) => WEEK_DAY_NAMES_FULL[d]).join(', ');
      summary = `${intervalText}${
        interval === 1 ? 'Ogni settimana' : 'settimane'
      } • ${days}`;
      break;
    case 'monthly':
      summary = `${intervalText}${
        interval === 1 ? 'Ogni mese' : 'mesi'
      } • giorno ${monthDay}`;
      break;
    case 'yearly':
      summary = `${intervalText}${
        interval === 1 ? 'Ogni anno' : 'anni'
      } • ${MONTH_NAMES[yearMonth]} ${monthDay}`;
      break;
  }

  if (endType === 'date' && endDate) {
    summary += ` fino al ${new Date(endDate).toLocaleDateString('it-IT')}`;
  } else if (endType === 'occurrences') {
    summary += ` per ${occurrences} occorrenze`;
  }

  return summary;
};
