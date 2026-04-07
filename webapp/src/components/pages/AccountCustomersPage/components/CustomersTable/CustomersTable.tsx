import { useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { ICustomer } from '@/types';

import DeleteCustomer from '../modals/DeleteCustomer/DeleteCustomer';
import EditCustomer from '../modals/EditCustomer/EditCustomer';
import PauseCustomer from '../modals/PauseCustomer/PauseCustomer';

interface IProps {
  customers: ICustomer[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const CustomersTable = ({ customers, isLoading, callback, accountId }: IProps) => {
  const [pausedCustomer, setPausedCustomer] = useState<ICustomer | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<ICustomer | null>(null);
  const [deletedCustomer, setDeletedCustomer] = useState<ICustomer | null>(null);

  const columns: ColumnDef<ICustomer>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (c) => c.name,
    },
    {
      key: 'amount',
      title: 'Amount per month',
      sortable: true,
      sortFn: (a, b) => a.monthlyPayment - b.monthlyPayment,
      render: (c) => c.monthlyPayment,
    },
    {
      key: 'currency',
      title: 'Currency',
      render: (c) => currencySymbols[c.currency],
    },
    {
      key: 'paymentDay',
      title: 'Approximately payment day',
      sortable: true,
      sortFn: (a, b) => a.approximatelyPaymentDay - b.approximatelyPaymentDay,
      render: (c) => c.approximatelyPaymentDay,
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (c) => (
        <div className="flex w-full justify-end">
          <IconButton
            iconHeight={18}
            iconColor="LIGHT"
            icon={c.isCancelled ? 'Play' : 'Pause'}
            onClick={() => setPausedCustomer(c)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => setEditedCustomer(c)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => setDeletedCustomer(c)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {deletedCustomer && (
        <DeleteCustomer
          callback={callback}
          customer={deletedCustomer}
          handleClose={() => setDeletedCustomer(null)}
        />
      )}
      {editedCustomer && (
        <EditCustomer
          customer={editedCustomer}
          callback={callback}
          handleClose={() => setEditedCustomer(null)}
        />
      )}
      {pausedCustomer && (
        <PauseCustomer
          customer={pausedCustomer}
          callback={callback}
          handleClose={() => setPausedCustomer(null)}
        />
      )}
      <DataTable
        title="Current active customers"
        data={customers}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-5"
        rowKey={(c) => c.id}
        getRowHref={(c) => `/account/${accountId}/customers/${c.id}`}
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(c) => c.name}
      />
    </>
  );
};

export default CustomersTable;
