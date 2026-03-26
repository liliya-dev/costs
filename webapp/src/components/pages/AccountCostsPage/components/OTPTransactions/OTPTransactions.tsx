import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IOTP, Currency, ITag } from '@/types';

import OTPTransactionRow from './components/OTPTransactionRow';
import OTPTransactionsEmpty from './components/OTPTransactionsEmpty';
import OTPTransactionsHeader from './components/OTPTransactionsHeader';

interface IProps {
  accountId: number;
  transactions: IOTP[];
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const OTPTransactions = ({ transactions, selectedCurrency, onTagClick }: IProps) => (
  <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
    <div className="mb-12 flex justify-between">
      <TableTitle title="One-time payments" />
    </div>

    <OTPTransactionsHeader selectedCurrency={selectedCurrency} />

    {transactions.length ? (
      transactions.map((transaction, index) => (
        <OTPTransactionRow
          key={transaction.id}
          transaction={transaction}
          selectedCurrency={selectedCurrency}
          isLast={index === transactions.length - 1}
          onTagClick={onTagClick}
        />
      ))
    ) : (
      <OTPTransactionsEmpty />
    )}
  </div>
);

export default OTPTransactions;
