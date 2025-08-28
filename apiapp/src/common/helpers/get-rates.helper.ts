export interface ExchangeRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface IConvertedRates {
  rateUahToUsd: number | null;
  rateUahToEur: number | null;
}

export function getRates(rates: ExchangeRate[]): IConvertedRates {
  let rateUahToUsd: number | null = null;
  let rateUahToEur: number | null = null;

  for (const rate of rates) {
    if (rate.ccy === 'USD') {
      rateUahToUsd = parseFloat(rate.sale);
    } else if (rate.ccy === 'EUR') {
      rateUahToEur = parseFloat(rate.sale);
    }
  }

  return { rateUahToUsd, rateUahToEur };
}
