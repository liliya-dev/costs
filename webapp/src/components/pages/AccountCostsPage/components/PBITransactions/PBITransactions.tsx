import Link from 'next/link';

import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols, StatusColors } from '@/constants';
import { IPBITransaction, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  accountId: number;
  transactions: IPBITransaction[];
  selectedCurrency: Currency;
}

const headers = ['Name', 'Amount', 'UAH-USD', 'UAH_EUR', 'Date should be paid', 'Date paid'];

const PBITransactions = ({ transactions, accountId, selectedCurrency }: IProps) => {
  return (
    <div>
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="PBI Payments" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {headers.map((item) => (
              <TableHeader
                key={item}
                title={item !== 'Amount' ? item : `${item} (${currencySymbols[selectedCurrency]})`}
              />
            ))}
          </div>
        </div>
        <>
          {transactions.map(
            (
              {
                amount,
                currency,
                rateUahToEur,
                rateUahToUsd,
                datePaid,
                dateShouldBePaid,
                pbiName,
                pbiId,
                status,
              },
              index,
            ) => (
              <Link
                key={index}
                href={`/account/${accountId}/costs/installments/${pbiId}`}
                className="contents"
              >
                <div
                  className={`grid cursor-pointer grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-6 ${
                    index === transactions.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-dark-3'
                  }`}
                >
                  <TableRow>
                    <div className="flex">
                      <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: StatusColors[status] }}
                        />
                      </div>
                      <p className="font-medium">
                        {pbiName} ({amount}
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
                  <TableRow>{formatDate(dateShouldBePaid)}</TableRow>
                  <TableRow>{formatDate(datePaid)}</TableRow>
                </div>
              </Link>
            ),
          )}
          {!transactions.length && (
            <div className="bg-white px-6 py-12">
              <p className="text-center text-lg">There are no PBI transactions in this period</p>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default PBITransactions;
