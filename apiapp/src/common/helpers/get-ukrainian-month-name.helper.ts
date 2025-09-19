export enum MonthCase {
  Nominative = 'nominative',
  Genitive = 'genitive',
}

export function getUkrainianMonthName(
  month: number,
  gramCase: MonthCase = MonthCase.Nominative,
): string {
  const monthsNominative = [
    'січень',
    'лютий',
    'березень',
    'квітень',
    'травень',
    'червень',
    'липень',
    'серпень',
    'вересень',
    'жовтень',
    'листопад',
    'грудень',
  ];

  const monthsGenitive = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  return gramCase === MonthCase.Nominative
    ? monthsNominative[month - 1]
    : monthsGenitive[month - 1];
}
