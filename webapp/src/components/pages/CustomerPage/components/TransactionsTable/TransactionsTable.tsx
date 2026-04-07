import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IIRP } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  payments: IIRP[];
}

const columns: ColumnDef<IIRP>[] = [
  {
    key: 'amount',
    title: 'Amount paid',
    sortable: true,
    sortFn: (a, b) => a.amount - b.amount,
    render: (p) => (Number.isInteger(p.amount) ? p.amount.toString() : p.amount.toFixed(2)),
  },
  {
    key: 'currency',
    title: 'Currency',
    render: (p) => currencySymbols[p.currency],
  },
  { key: 'uahUsd', title: 'UAH_USD', render: (p) => p.rateUahToUsd },
  { key: 'uahEur', title: 'UAH_EUR', render: (p) => p.rateUahToEur },
  {
    key: 'datePaid',
    title: 'Date paid',
    sortable: true,
    sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
    render: (p) => formatDate(p.datePaid),
  },
  {
    key: 'dateShouldBePaid',
    title: 'Date shold be paid',
    sortable: true,
    sortFn: (a, b) =>
      new Date(a.dateShouldBePaid).getTime() - new Date(b.dateShouldBePaid).getTime(),
    render: (p) => formatDate(p.dateShouldBePaid),
  },
];

const TransactionsTable = ({ payments }: IProps) => (
  <DataTable
    title="Current list of made payments"
    data={payments}
    isLoading={false}
    columns={columns}
    gridCols="grid-cols-3 sm:grid-cols-6"
    rowKey={(p) => `${p.customerId}-${p.dateShouldBePaid}`}
    emptyState={
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        No payments yet from this customer
      </div>
    }
  />
);

export default TransactionsTable;
