export function getMinDateFromDates(dates: { date: string }[]): Date | null {
  return dates.reduce<Date | null>((min, d) => {
    const current = new Date(d.date);
    return !min || current < min ? current : min;
  }, null);
}
