import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import { currencySymbols, StatusColors } from '@/constants';
import { IIRP, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  irps: IIRP[];
  selectedCurrency: Currency;
  handleOpenEditIRP: (irp: IIRP) => void;
  handleOpenDeleteIRP: (irp: IIRP) => void;
  accountId: number;
}

const IRPsList = ({
  irps,
  selectedCurrency,
  handleOpenDeleteIRP,
  handleOpenEditIRP,
  accountId,
}: IProps) => {
  return (
    <>
      {irps.map(
        (
          {
            amount,
            currency,
            rateUahToEur,
            rateUahToUsd,
            datePaid,
            dateShouldBePaid,
            status,
            customerName,
            customerId,
          },
          index,
        ) => (
          <div
            className={`grid grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-7 ${
              index === irps.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
            }`}
            key={index}
          >
            <Link href={`/account/${accountId}/customers/${customerId}`} className="contents">
              <TableRow>
                <div className="flex">
                  <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: StatusColors[status] }}
                    />
                  </div>
                  <p className="font-medium">
                    {customerName} ({amount}
                    {currencySymbols[currency]})
                  </p>
                </div>
              </TableRow>
              <TableRow>
                {convertAmountToCurrency({
                  amount,
                  selectedCurrency,
                  rateUahToEur,
                  rateUahToUsd,
                  currency,
                })}
              </TableRow>
              <TableRow>{rateUahToUsd}</TableRow>
              <TableRow>{rateUahToEur}</TableRow>
              <TableRow>{formatDate(datePaid)}</TableRow>
              <TableRow>{formatDate(dateShouldBePaid)}</TableRow>
            </Link>
            {datePaid && (
              <TableRow>
                <div className="flex w-full justify-end">
                  <IconButton
                    iconHeight={24}
                    iconColor="LIGHT"
                    icon="Edit"
                    onClick={() => handleOpenEditIRP(irps[index])}
                  />
                  <div className="ml-4" />
                  <IconButton
                    iconHeight={24}
                    iconColor="RED"
                    icon="Trash"
                    onClick={() => handleOpenDeleteIRP(irps[index])}
                  />
                </div>
              </TableRow>
            )}
          </div>
        ),
      )}
      {!irps.length && (
        <div className="bg-white px-6 py-12">
          <p className="text-center text-lg">
            There are no income payments with this status, try to change filters
          </p>
        </div>
      )}
    </>
  );
};

export default IRPsList;
