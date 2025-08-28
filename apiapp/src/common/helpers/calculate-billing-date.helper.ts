export function calculateBillingDate(
  startDate: Date,
  dayNumber: number,
  periods: number,
  isLastPayment: boolean,
): Date {
  const billingStart = new Date(startDate);
  if (dayNumber > 14 && billingStart.getDate() < 15 && !isLastPayment) {
    billingStart.setMonth(billingStart.getMonth() - 1);
  } else if (dayNumber < 15 && billingStart.getDate() > 15 && !isLastPayment) {
    billingStart.setMonth(billingStart.getMonth() + 1);
  } else {
  }
  billingStart.setDate(15);
  const newBillingDate = new Date(billingStart);
  newBillingDate.setHours(12);
  newBillingDate.setMinutes(0);
  newBillingDate.setMonth(newBillingDate.getMonth() + periods);
  newBillingDate.setDate(dayNumber);
  return newBillingDate;
}
