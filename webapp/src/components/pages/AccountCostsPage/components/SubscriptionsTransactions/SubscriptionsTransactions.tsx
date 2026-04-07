import Tag from '@/components/atoms/Tag/Tag';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols, StatusColors } from '@/constants';
import { ISubscriptionTransaction, Currency, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import SubscriptionsTransactionsEmpty from './components/SubscriptionsTransactionsEmpty';

interface IProps {
  accountId: number;
  subscriptions: ISubscriptionTransaction[];
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const SubscriptionsTransactions = ({
  subscriptions,
  accountId,
  selectedCurrency,
  onTagClick,
}: IProps) => {
  const columns: ColumnDef<ISubscriptionTransaction>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.subscriptionName.localeCompare(b.subscriptionName),
      render: (t) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: t.datePaid ? StatusColors.PAID_IN_PERIOD : StatusColors.NOT_PAID,
              }}
            />
          </div>
          <p className="font-medium">
            {t.subscriptionName} ({t.amount}
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
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (t) => (
        <>
          {t.subscriptionTags.map((tag) => (
            <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
          ))}
        </>
      ),
    },
  ];

  return (
    <DataTable
      title="Subscriptions payments"
      data={subscriptions}
      isLoading={false}
      columns={columns}
      gridCols="grid-cols-3 sm:grid-cols-6"
      rowKey={(t) => t.subscriptionId}
      getRowHref={(t) => `/account/${accountId}/costs/subscriptions/${t.subscriptionId}`}
      emptyState={<SubscriptionsTransactionsEmpty />}
    />
  );
};

export default SubscriptionsTransactions;
