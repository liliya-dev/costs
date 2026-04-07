import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import { TableCell } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols, StatusColors } from '@/constants';
import { IIRP, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

const STATUS_ORDER = ['PAID_IN_PERIOD', 'PAID_BEFORE', 'PAID_IN_ADVANCE', 'NOT_PAID'];

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
  const sortedIrps = [...irps].sort((a, b) => {
    const statusA = STATUS_ORDER.indexOf(a.status);
    const statusB = STATUS_ORDER.indexOf(b.status);

    if (statusA !== statusB) {
      return statusA - statusB; // sort by status order
    }

    // inside NOT_PAID, sort by dateShouldBePaid asc
    if (a.status === 'NOT_PAID' && b.status === 'NOT_PAID') {
      return new Date(a.dateShouldBePaid).getTime() - new Date(b.dateShouldBePaid).getTime();
    }

    return 0;
  });
  return (
    <>
      {sortedIrps.map(
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
              <TableCell>
                <div className="flex">
                  <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: StatusColors[status] }}
                    />
                  </div>
                  <p className="font-medium">
                    {customerName} (
                    {Number.isInteger(amount) ? amount.toString() : amount.toFixed(2)}
                    {currencySymbols[currency]})
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {convertAmountToCurrency({
                  amount,
                  selectedCurrency,
                  rateUahToEur,
                  rateUahToUsd,
                  currency,
                })}
              </TableCell>
              <TableCell>{rateUahToUsd}</TableCell>
              <TableCell>{rateUahToEur}</TableCell>
              <TableCell>{formatDate(datePaid)}</TableCell>
              <TableCell>{formatDate(dateShouldBePaid)}</TableCell>
            </Link>
            {datePaid && (
              <TableCell>
                <div className="flex w-full justify-end">
                  <IconButton
                    iconHeight={24}
                    iconColor="LIGHT"
                    icon="Edit"
                    onClick={() => handleOpenEditIRP(sortedIrps[index])}
                  />
                  <div className="ml-4" />
                  <IconButton
                    iconHeight={24}
                    iconColor="RED"
                    icon="Trash"
                    onClick={() => handleOpenDeleteIRP(sortedIrps[index])}
                  />
                </div>
              </TableCell>
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
