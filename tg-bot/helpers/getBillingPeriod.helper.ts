export const getBillingPeriod = (
  today: Date,
  skipPeriods: number = 0,
): { startDate: string; endDate: string } => {
  const currentDay = today.getDate();
  let startMonth: number;
  let endMonth: number;
  let startYear: number = today.getFullYear();
  let endYear: number = today.getFullYear();

  if (currentDay >= 15) {
    startMonth = today.getMonth();
    endMonth = today.getMonth() + 1;
  } else {
    startMonth = today.getMonth() - 1;
    endMonth = today.getMonth();
  }

  startMonth += skipPeriods;
  endMonth += skipPeriods;

  while (startMonth < 0) {
    startMonth += 12;
    startYear--;
  }
  while (startMonth > 11) {
    startMonth -= 12;
    startYear++;
  }

  while (endMonth < 0) {
    endMonth += 12;
    endYear--;
  }
  while (endMonth > 11) {
    endMonth -= 12;
    endYear++;
  }

  const startDate = new Date(startYear, startMonth, 15, 1).toISOString();
  const endDate = new Date(endYear, endMonth, 14, 1).toISOString();

  return { startDate, endDate };
};
