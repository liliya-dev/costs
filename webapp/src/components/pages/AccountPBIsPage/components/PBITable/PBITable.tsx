import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IPBI, ITag } from '@/types';

import DeletePBI from '../modals/DeletePBI/DeletePBI';
import EditPBI from '../modals/EditPBI/EditPBI';
import PayPBI from '../modals/PayPBI/PayPBI';

import PBITags from './components/PBITags';
import EmptyPBIs from './components/EmptyPBIs';

interface IProps {
  pbis: IPBI[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const statusOptions = [
  { id: 'active', label: 'Active' },
  { id: 'paid', label: 'Paid' },
  { id: 'all', label: 'All' },
];

const PBITable = ({ pbis, isLoading, callback, accountId }: IProps) => {
  const [payedPBI, setPayedPBI] = useState<IPBI | null>(null);
  const [editedPBI, setEditedPBI] = useState<IPBI | null>(null);
  const [deletedPBI, setDeletedPBI] = useState<IPBI | null>(null);

  const columns: ColumnDef<IPBI>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (pbi) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: pbi.isFullyPaid ? '#22c55e' : '#f59e0b' }}
            />
          </div>
          <p className="font-medium">{pbi.name}</p>
        </div>
      ),
    },
    {
      key: 'payment',
      title: 'Payment',
      sortable: true,
      sortFn: (a, b) => a.monthlyPayment - b.monthlyPayment,
      render: (pbi) => `${pbi.monthlyPayment} ${currencySymbols[pbi.currency]}`,
    },
    {
      key: 'paymentsDone',
      title: 'Payments done',
      sortable: true,
      sortFn: (a, b) => a.numberOfDownpayments - b.numberOfDownpayments,
      render: (pbi) =>
        `${pbi.transactions.length + pbi.numberOfDownpayments} / ${pbi.numberOfPayments}`,
    },
    {
      key: 'paymentDay',
      title: 'Payment day',
      sortable: true,
      sortFn: (a, b) => a.approximatelyPaymentDay - b.approximatelyPaymentDay,
      render: (pbi) => pbi.approximatelyPaymentDay,
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (pbi, onTagClick) => <PBITags tags={pbi.tags} onTagClick={onTagClick} />,
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (pbi) => (
        <div className="flex w-full justify-end">
          {!pbi.isFullyPaid && (
            <>
              <IconButton
                iconHeight={24}
                iconColor="DARK"
                icon="Pay"
                onClick={() => setPayedPBI(pbi)}
              />
              <div className="ml-4" />
            </>
          )}
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => setEditedPBI(pbi)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => setDeletedPBI(pbi)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {deletedPBI && (
        <DeletePBI callback={callback} pbi={deletedPBI} handleClose={() => setDeletedPBI(null)} />
      )}
      {editedPBI && (
        <EditPBI
          accountId={accountId}
          pbi={editedPBI}
          callback={callback}
          handleClose={() => setEditedPBI(null)}
        />
      )}
      {payedPBI && (
        <PayPBI pbi={payedPBI} callback={callback} handleClose={() => setPayedPBI(null)} />
      )}
      <DataTable
        title="All payments by installments"
        data={pbis}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-6"
        rowKey={(pbi) => pbi.id}
        getRowHref={(pbi) => `/account/${accountId}/costs/installments/${pbi.id}`}
        enableTagFilter
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(pbi) => pbi.name}
        statusFilter={{
          title: 'Payments by installments status',
          options: statusOptions,
          defaultValue: 'active',
          filterFn: (pbi, value) => {
            if (value === 'all') return true;
            return value === 'active' ? !pbi.isFullyPaid : pbi.isFullyPaid;
          },
        }}
        emptyState={<EmptyPBIs />}
      />
    </>
  );
};

export default PBITable;
