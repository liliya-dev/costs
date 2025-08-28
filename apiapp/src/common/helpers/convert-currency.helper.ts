import { Currency } from '../enums/currency.enum';

interface CurrencyConversionParams {
  amount: number;
  baseCurrency: Currency;
  paymentCurrency: Currency;
  rateUahToEur: number;
  rateUahToUsd: number;
}

export const convertCurrency = ({
  amount,
  baseCurrency,
  paymentCurrency,
  rateUahToEur,
  rateUahToUsd,
}: CurrencyConversionParams): number => {
  let amountInUah: number;

  if (paymentCurrency === Currency.UAH) {
    amountInUah = amount;
  } else if (paymentCurrency === Currency.EUR) {
    amountInUah = amount * rateUahToEur;
  } else if (paymentCurrency === Currency.USD) {
    amountInUah = amount * rateUahToUsd;
  }

  if (baseCurrency === Currency.UAH) {
    return amountInUah;
  } else if (baseCurrency === Currency.EUR) {
    return amountInUah / rateUahToEur;
  } else if (baseCurrency === Currency.USD) {
    return amountInUah / rateUahToUsd;
  }

  return amountInUah;
};
