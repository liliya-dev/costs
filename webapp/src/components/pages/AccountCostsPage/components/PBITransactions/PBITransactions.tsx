import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IPBITransaction, Currency } from '@/types';

import PBITransactionRow from './components/PBITransactionRow';
import PBITransactionsEmpty from './components/PBITransactionsEmpty';
import PBITransactionsHeader from './components/PBITransactionsHeader';

interface IProps {
  accountId: number;
  transactions: IPBITransaction[];
  selectedCurrency: Currency;
}

const PBITransactions = ({ transactions, accountId, selectedCurrency }: IProps) => (
  <div>
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-12 flex justify-between">
        <TableTitle title="PBI Payments" />
      </div>

      <PBITransactionsHeader selectedCurrency={selectedCurrency} />

      {transactions.length ? (
        transactions.map((transaction, index) => (
          <PBITransactionRow
            key={transaction.pbiId}
            transaction={transaction}
            accountId={accountId}
            isLast={index === transactions.length - 1}
            selectedCurrency={selectedCurrency}
          />
        ))
      ) : (
        <PBITransactionsEmpty />
      )}
    </div>
  </div>
);

export default PBITransactions;
