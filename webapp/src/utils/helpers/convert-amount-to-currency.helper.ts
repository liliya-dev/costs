import { Currency } from '@/types';

interface IProps {
  amount: number;
  currency: string;
  rateUahToEur: number;
  rateUahToUsd: number;
  selectedCurrency: Currency;
}

export const convertAmountToCurrency = ({
  amount,
  currency,
  selectedCurrency,
  rateUahToEur,
  rateUahToUsd,
}: IProps): number => {
  let convertedAmount = amount;

  switch (currency) {
    case Currency.USD:
      if (selectedCurrency === Currency.EUR) {
        convertedAmount = (amount * rateUahToUsd) / rateUahToEur;
      } else if (selectedCurrency === Currency.UAH) {
        convertedAmount = amount * rateUahToUsd;
      }
      break;
    case Currency.EUR:
      if (selectedCurrency === Currency.USD) {
        convertedAmount = (amount * rateUahToEur) / rateUahToUsd;
      } else if (selectedCurrency === Currency.UAH) {
        convertedAmount = amount * rateUahToEur;
      }
      break;
    case Currency.UAH:
      if (selectedCurrency === Currency.USD) {
        convertedAmount = amount / rateUahToUsd;
      } else if (selectedCurrency === Currency.EUR) {
        convertedAmount = amount / rateUahToEur;
      }
      break;
    default:
      break;
  }

  return Math.ceil(+convertedAmount * 100) / 100;
};
