export function getDateRange(skip: number = 0): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear() + skip, now.getMonth() - 3, now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear() + skip, now.getMonth() + 9, now.getDate(), 0, 0, 0, 0);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}
