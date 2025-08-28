function stripTimeUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

const isSameOrAfterUTCDate = (
  date1: Date | string,
  date2: Date | string,
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return stripTimeUTC(d1).getTime() >= stripTimeUTC(d2).getTime();
};

const isSameOrBeforeUTCDate = (
  date1: Date | string,
  date2: Date | string,
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return stripTimeUTC(d1).getTime() <= stripTimeUTC(d2).getTime();
};

export const findSpecificDatesInRange = (
  startIso: string,
  endIso: string,
  dayOfMonth: number,
  excludedDates: string[] = [],
  createdDate: Date,
): string[] => {
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);

  if (endDate <= startDate) {
    throw new Error('End date must be after the start date.');
  }
  const validDates: string[] = [];
  if (dayOfMonth < 1 || dayOfMonth > 31) {
    throw new Error('Day of month must be between 1 and 31.');
  }
  const excludedDatesSet = new Set(
    excludedDates.map((dateStr) => {
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 10);
    }),
  );

  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth();
  const endYear = endDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth();

  for (let year = startYear; year <= endYear; year++) {
    for (
      let month = year === startYear ? startMonth : 0;
      month <= (year === endYear ? endMonth : 11);
      month++
    ) {
      const candidateDate = new Date(Date.UTC(year, month, dayOfMonth));
      if (
        isSameOrAfterUTCDate(candidateDate, startDate) &&
        isSameOrAfterUTCDate(candidateDate, createdDate) &&
        isSameOrBeforeUTCDate(candidateDate, endDate)
      ) {
        const dateStr = candidateDate.toISOString().slice(0, 10);
        if (!excludedDatesSet.has(dateStr)) {
          validDates.push(candidateDate.toISOString());
        }
      }
    }
  }

  return validDates;
};
