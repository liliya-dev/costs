import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols } from '@/constants';
import { IOTP, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  accountId: number;
  selectedCurrency: Currency;
  transactions: IOTP[];
}

const OTPTransactions = ({ selectedCurrency, transactions }: IProps) => {
  const headers = ['Name', 'Amount', 'UAH-USD', 'UAH_EUR', 'Date paid', 'Description'];

  return (
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-12 flex justify-between">
        <TableTitle title="One-time payments" />
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
            { amount, currency, rateUahToEur, rateUahToUsd, datePaid, name, id, description },
            index,
          ) => (
            <div key={id}>
              <div
                className={`grid grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-6 ${
                  index === transactions.length - 1
                    ? ''
                    : 'border-b border-stroke dark:border-dark-3'
                }`}
              >
                <TableRow>
                  <p className="font-medium">
                    {name} ({amount}
                    {currencySymbols[currency]})
                  </p>
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
                <TableRow>{description}</TableRow>
              </div>
            </div>
          ),
        )}
        {!transactions.length && (
          <div className="bg-white px-6 py-12">
            <p className="text-center text-lg">There are no one-time payments in this period</p>
          </div>
        )}
      </>
    </div>
  );
};

export default OTPTransactions;
