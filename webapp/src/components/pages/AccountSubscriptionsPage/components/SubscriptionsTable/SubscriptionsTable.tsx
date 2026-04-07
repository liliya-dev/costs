import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols, SubscriptionsStatusColors, SubscriptionsStatusTypes } from '@/constants';
import { ISubscription, ITag } from '@/types';

import DeleteSubscription from '../modals/DeleteSubscription/DeleteSubscription';
import EditSubscription from '../modals/EditSubscription/EditSubscription';
import PauseSubscription from '../modals/PauseSubscription/PauseSubscription';

import SubscriptionTags from './components/SubscriptionTags';
import EmptySubscriptions from './components/EmptySubscriptions';

interface IProps {
  subscriptions: ISubscription[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const statusOptions = [
  { id: 'active', label: 'Active' },
  { id: 'canceled', label: 'Canceled' },
  { id: 'all', label: 'All' },
];

const SubscriptionsTable = ({ subscriptions, isLoading, callback, accountId }: IProps) => {
  const [pausedSubscription, setPausedSubscription] = useState<ISubscription | null>(null);
  const [editedSubscription, setEditedSubscription] = useState<ISubscription | null>(null);
  const [deletedSubscription, setDeletedSubscription] = useState<ISubscription | null>(null);

  const columns: ColumnDef<ISubscription>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (sub) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: sub.isCancelled
                  ? SubscriptionsStatusColors[SubscriptionsStatusTypes.INACTIVE]
                  : SubscriptionsStatusColors[SubscriptionsStatusTypes.ACTIVE],
              }}
            />
          </div>
          <p className="font-medium">{sub.name}</p>
        </div>
      ),
    },
    {
      key: 'payment',
      title: 'Payment',
      sortable: true,
      sortFn: (a, b) => a.monthlyPayment - b.monthlyPayment,
      render: (sub) => `${sub.monthlyPayment} ${currencySymbols[sub.currency]}`,
    },
    {
      key: 'paymentDay',
      title: 'Payment day',
      sortable: true,
      sortFn: (a, b) => a.approximatelyPaymentDay - b.approximatelyPaymentDay,
      render: (sub) => sub.approximatelyPaymentDay,
    },
    {
      key: 'description',
      title: 'Description',
      render: (sub) => sub.description,
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (sub, onTagClick) => <SubscriptionTags tags={sub.tags} onTagClick={onTagClick} />,
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (sub) => (
        <div className="flex w-full justify-end">
          <IconButton
            iconHeight={18}
            iconColor="LIGHT"
            icon={sub.isCancelled ? 'Play' : 'Pause'}
            onClick={() => setPausedSubscription(sub)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => setEditedSubscription(sub)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => setDeletedSubscription(sub)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {deletedSubscription && (
        <DeleteSubscription
          callback={callback}
          subscription={deletedSubscription}
          handleClose={() => setDeletedSubscription(null)}
        />
      )}
      {editedSubscription && (
        <EditSubscription
          accountId={accountId}
          subscription={editedSubscription}
          callback={callback}
          handleClose={() => setEditedSubscription(null)}
        />
      )}
      {pausedSubscription && (
        <PauseSubscription
          subscription={pausedSubscription}
          callback={callback}
          handleClose={() => setPausedSubscription(null)}
        />
      )}
      <DataTable
        title="Current active subscriptions"
        data={subscriptions}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-6"
        rowKey={(sub) => sub.id}
        getRowHref={(sub) => `/account/${accountId}/costs/subscriptions/${sub.id}`}
        enableTagFilter
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(sub) => sub.name}
        statusFilter={{
          title: 'Subscription status',
          options: statusOptions,
          defaultValue: 'active',
          filterFn: (sub, value) => {
            if (value === 'all') return true;
            return value === 'active' ? !sub.isCancelled : sub.isCancelled;
          },
        }}
        emptyState={<EmptySubscriptions />}
      />
    </>
  );
};

export default SubscriptionsTable;
