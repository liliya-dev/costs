import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IRC, ITag } from '@/types';

import DeleteRC from '../modals/DeleteRC/DeleteRC';
import EditRC from '../modals/EditRC/EditRC';
import PayRC from '../modals/PayRC/PayRC';

import RCListTags from './components/RCListTags';
import EmptyRCs from './components/EmptyRCs';

interface IProps {
  rcs: IRC[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const RCTable = ({ rcs, isLoading, callback, accountId }: IProps) => {
  const [editedRC, setEditedRC] = useState<IRC | null>(null);
  const [payedRC, setPayedRC] = useState<IRC | null>(null);
  const [deletedRC, setDeletedRC] = useState<IRC | null>(null);

  const columns: ColumnDef<IRC>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (rc) => <p className="font-medium">{rc.name}</p>,
    },
    {
      key: 'payment',
      title: 'Payment',
      sortable: true,
      sortFn: (a, b) => a.monthlyPayment - b.monthlyPayment,
      render: (rc) => `${rc.monthlyPayment} ${currencySymbols[rc.currency]}`,
    },
    {
      key: 'paymentDay',
      title: 'Payment day',
      sortable: true,
      sortFn: (a, b) => a.approximatelyPaymentDay - b.approximatelyPaymentDay,
      render: (rc) => rc.approximatelyPaymentDay,
    },
    {
      key: 'permanent',
      title: 'Permanent?',
      render: (rc) => (rc.isPermanentAmount ? 'Yes' : 'No'),
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (rc, onTagClick) => <RCListTags tags={rc.tags} onTagClick={onTagClick} />,
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (rc) => (
        <div className="flex w-full justify-end">
          <IconButton iconHeight={24} iconColor="DARK" icon="Pay" onClick={() => setPayedRC(rc)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="LIGHT" icon="Edit" onClick={() => setEditedRC(rc)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="RED" icon="Trash" onClick={() => setDeletedRC(rc)} />
        </div>
      ),
    },
  ];

  return (
    <>
      {payedRC && <PayRC handleClose={() => setPayedRC(null)} rc={payedRC} callback={callback} />}
      {deletedRC && (
        <DeleteRC handleClose={() => setDeletedRC(null)} rc={deletedRC} callback={callback} />
      )}
      {editedRC && (
        <EditRC
          handleClose={() => setEditedRC(null)}
          rc={editedRC}
          callback={callback}
          accountId={accountId}
        />
      )}
      <DataTable
        title="All regular costs"
        data={rcs}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-6"
        rowKey={(rc) => rc.id}
        getRowHref={(rc) => `/account/${accountId}/costs/regular/${rc.id}`}
        enableTagFilter
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(rc) => rc.name}
        emptyState={<EmptyRCs />}
      />
    </>
  );
};

export default RCTable;
