import Link from 'next/link';

import Tag from '@/components/atoms/Tag/Tag';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols, StatusColors } from '@/constants';
import { IPBITransaction, Currency, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import PBITransactionsEmpty from './components/PBITransactionsEmpty';

interface IProps {
  accountId: number;
  transactions: IPBITransaction[];
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const PBITransactions = ({ transactions, accountId, selectedCurrency, onTagClick }: IProps) => {
  const columns: ColumnDef<IPBITransaction>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.pbiName.localeCompare(b.pbiName),
      render: (t) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: StatusColors[t.status] }} />
          </div>
          <p className="font-medium">
            {t.pbiName} ({t.amount}
            {currencySymbols[t.currency]})
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: `Amount (${currencySymbols[selectedCurrency]})`,
      sortable: true,
      sortFn: (a, b) => a.amount - b.amount,
      render: (t) =>
        convertAmountToCurrency({
          amount: t.amount,
          selectedCurrency,
          rateUahToEur: t.rateUahToEur,
          rateUahToUsd: t.rateUahToUsd,
          currency: t.currency,
        }),
    },
    {
      key: 'uahUsd',
      title: 'UAH-USD',
      sortable: true,
      sortFn: (a, b) => a.rateUahToUsd - b.rateUahToUsd,
      render: (t) => t.rateUahToUsd,
    },
    {
      key: 'uahEur',
      title: 'UAH-EUR',
      sortable: true,
      sortFn: (a, b) => a.rateUahToEur - b.rateUahToEur,
      render: (t) => t.rateUahToEur,
    },
    {
      key: 'dateShouldBePaid',
      title: 'Date should be paid',
      sortable: true,
      sortFn: (a, b) =>
        new Date(a.dateShouldBePaid).getTime() - new Date(b.dateShouldBePaid).getTime(),
      render: (t) => formatDate(t.dateShouldBePaid),
    },
    {
      key: 'datePaid',
      title: 'Date paid',
      sortable: true,
      sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
      render: (t) => formatDate(t.datePaid),
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (t) => (
        <>
          {t.pbiTags.map((tag) => (
            <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
          ))}
        </>
      ),
    },
  ];

  return (
    <DataTable
      title="PBI Payments"
      data={transactions}
      isLoading={false}
      columns={columns}
      gridCols="grid-cols-3 sm:grid-cols-7"
      rowKey={(t) => t.pbiId}
      getRowHref={(t) => `/account/${accountId}/costs/installments/${t.pbiId}`}
      emptyState={<PBITransactionsEmpty />}
    />
  );
};

export default PBITransactions;
