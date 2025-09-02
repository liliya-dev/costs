import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { RCTransaction, Currency } from '@/types';

import RCTransactionRow from './components/RCTransactionRow';
import RCTransactionsEmpty from './components/RCTransactionsEmpty';
import RCTransactionsHeader from './components/RCTransactionsHeader';

interface IProps {
  accountId: number;
  transactions: RCTransaction[];
  selectedCurrency: Currency;
}

const RCTransactions = ({ transactions, accountId, selectedCurrency }: IProps) => {
  return (
    <div>
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Regular costs payments" />
        </div>

        <RCTransactionsHeader selectedCurrency={selectedCurrency} />

        {transactions.length ? (
          transactions.map((transaction, index) => (
            <RCTransactionRow
              key={transaction.id}
              transaction={transaction}
              accountId={accountId}
              isLast={index === transactions.length - 1}
              selectedCurrency={selectedCurrency}
            />
          ))
        ) : (
          <RCTransactionsEmpty />
        )}
      </div>
    </div>
  );
};

export default RCTransactions;
