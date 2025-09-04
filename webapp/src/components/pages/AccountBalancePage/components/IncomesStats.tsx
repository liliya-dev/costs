import React from 'react';

import { currencySymbols, StatusColors, StatusTexts } from '@/constants';
import { IconType } from '@/icons/svg/icons';
import { IIRP, Currency, Status } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';

interface IProps {
  irps: IIRP[];
  selectedCurrency: Currency;
  totalOti: number;
}

const IncomesStats = ({ irps, selectedCurrency, totalOti }: IProps) => {
  const IconComponent = IconType.Money;

  const getTotalByStatus = (status: Status) =>
    irps
      .filter((irp) => irp.status === status)
      .reduce(
        (sum, { amount, currency, rateUahToEur, rateUahToUsd }) =>
          sum +
          convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          }),
        0,
      );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {Object.values(Status)
          .filter((status) => status !== Status.PAID_BEFORE)
          .map((status) => {
            const total = getTotalByStatus(status);

            return (
              <div key={status} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <div
                  className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
                  style={{ backgroundColor: StatusColors[status] }}
                >
                  <IconComponent color="white" width={24} height={24} />
                </div>

                <div className="mt-6">
                  <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                    {total.toFixed(2)} {currencySymbols[selectedCurrency]}
                  </h4>
                  <span className="text-body-sm font-medium">{StatusTexts[status]}</span>
                  {status === Status.PAID_IN_PERIOD && totalOti > 0 && (
                    <p className="mt-2 text-body-sm text-gray-600 dark:text-gray-300">
                      + {totalOti.toFixed(2)} {currencySymbols[selectedCurrency]} from one-time
                      incomes
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <p className="mt-5 text-lg">
        <span className="font-medium">Total received</span>{' '}
        {(
          getTotalByStatus(Status.PAID_IN_PERIOD) +
          getTotalByStatus(Status.PAID_IN_ADVANCE) +
          totalOti
        ).toFixed(2)}{' '}
        {currencySymbols[selectedCurrency]}
      </p>
      <p className="mt-2 text-lg">
        <span className="font-medium">Total should be received</span>{' '}
        {getTotalByStatus(Status.NOT_PAID).toFixed(2)} {currencySymbols[selectedCurrency]}
      </p>
      <p className="mt-2 text-lg">
        <span className="font-medium">Total incomes for current period</span>{' '}
        {(
          getTotalByStatus(Status.PAID_IN_PERIOD) +
          getTotalByStatus(Status.PAID_IN_ADVANCE) +
          getTotalByStatus(Status.NOT_PAID) +
          totalOti
        ).toFixed(2)}{' '}
        {currencySymbols[selectedCurrency]}
      </p>
    </div>
  );
};

export default IncomesStats;
