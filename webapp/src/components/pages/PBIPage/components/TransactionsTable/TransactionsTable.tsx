import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IPBITransaction } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  transactions: IPBITransaction[];
}

const columns: ColumnDef<IPBITransaction>[] = [
  {
    key: 'amount',
    title: 'Amount paid',
    sortable: true,
    sortFn: (a, b) => a.amount - b.amount,
    render: (t) => (Number.isInteger(t.amount) ? t.amount.toString() : t.amount.toFixed(2)),
  },
  { key: 'currency', title: 'Currency', render: (t) => currencySymbols[t.currency] },
  { key: 'uahUsd', title: 'UAH_USD', render: (t) => t.rateUahToUsd },
  { key: 'uahEur', title: 'UAH_EUR', render: (t) => t.rateUahToEur },
  {
    key: 'datePaid',
    title: 'Date paid',
    sortable: true,
    sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
    render: (t) => formatDate(t.datePaid),
  },
];

const TransactionsTable = ({ transactions }: IProps) => (
  <DataTable
    title="Current list of made transactions"
    data={transactions}
    isLoading={false}
    columns={columns}
    gridCols="grid-cols-3 sm:grid-cols-5"
    rowKey={(t) => t.id}
    emptyState={
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        No payments yet for this payment by installments
      </div>
    }
  />
);

export default TransactionsTable;
