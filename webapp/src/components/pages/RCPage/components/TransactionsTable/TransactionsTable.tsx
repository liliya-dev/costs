import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols } from '@/constants';
import { RCTransaction } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  transactions: RCTransaction[];
}

const headers = ['Amount paid', 'Currency', 'UAH_USD', 'UAH_EUR', 'Date paid'];

const TransactionsTable = ({ transactions }: IProps) => {
  return (
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-12">
        <TableTitle title="Current list of made transactions" />
      </div>

      {transactions.length === 0 ? (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          No payments yet for this regular cost
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="grid grid-cols-3 sm:grid-cols-5">
              {headers.map((item) => (
                <TableHeader key={item} title={item} />
              ))}
            </div>
          </div>
          {transactions.map(({ datePaid, currency, rateUahToEur, rateUahToUsd, amount }, id) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                id === transactions.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
              }`}
              key={id}
            >
              <TableRow>{amount}</TableRow>
              <TableRow>{currencySymbols[currency]}</TableRow>
              <TableRow>{rateUahToUsd}</TableRow>
              <TableRow>{rateUahToEur}</TableRow>
              <TableRow>{formatDate(datePaid)}</TableRow>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
