export const checkIsDateInRange = (
  startIso: string,
  endIso: string,
  checkDateIso: string,
): boolean => {
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  const checkDate = new Date(checkDateIso);
  if (endDate < startDate) {
    throw new Error('End date must be after start date.');
  }
  return checkDate >= startDate && checkDate <= endDate;
};
