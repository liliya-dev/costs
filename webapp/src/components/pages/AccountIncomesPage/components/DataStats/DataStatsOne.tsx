import React from 'react';

import { StatusColors, StatusTexts } from '@/constants';
import { IconType } from '@/icons/svg/icons';
import { IIRP, Currency, Status } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';

interface IProps {
  irps: IIRP[];
  selectedCurrency: Currency;
  totalOti: number;
}

const DataStats = ({ irps, selectedCurrency, totalOti }: IProps) => {
  const IconComponent = IconType.Money;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {Object.values(Status).map((item) => (
          <div key={item} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: StatusColors[item] }}
            >
              <IconComponent color="white" width={24} height={24} />
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {irps
                    .filter((irp) => irp.status === item)
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
                    )
                    .toFixed(2)}

                  {totalOti > 0 && item === Status.PAID_IN_PERIOD && ` + ${totalOti.toFixed(2)}`}
                </h4>
                <span className="text-body-sm font-medium">
                  {StatusTexts[item]}{' '}
                  {totalOti > 0 &&
                    item === Status.PAID_IN_PERIOD &&
                    ` and one time income payments`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStats;
