import Tag from '@/components/atoms/Tag/Tag';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IOTP, Currency, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import OTPTransactionsEmpty from './components/OTPTransactionsEmpty';

interface IProps {
  accountId: number;
  transactions: IOTP[];
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const OTPTransactions = ({ transactions, selectedCurrency, onTagClick }: IProps) => {
  const columns: ColumnDef<IOTP>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (t) => (
        <p className="font-medium">
          {t.name} ({t.amount}
          {currencySymbols[t.currency]})
        </p>
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
      key: 'datePaid',
      title: 'Date paid',
      sortable: true,
      sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
      render: (t) => formatDate(t.datePaid),
    },
    {
      key: 'description',
      title: 'Description',
      render: (t) => t.description,
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (t) => (
        <>
          {t.tags.map((tag) => (
            <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
          ))}
        </>
      ),
    },
  ];

  return (
    <DataTable
      title="One-time payments"
      data={transactions}
      isLoading={false}
      columns={columns}
      gridCols="grid-cols-3 sm:grid-cols-7"
      rowKey={(t) => t.id}
      emptyState={<OTPTransactionsEmpty />}
    />
  );
};

export default OTPTransactions;
