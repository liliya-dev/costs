import { useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IFOPCustomer } from '@/types';

import DeleteFopCustomer from './components/modals/DeleteFopCustomer/DeleteFopCustomer';
import EditCustomer from './components/modals/EditCustomer/EditCustomer';

interface IProps {
  customers: IFOPCustomer[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const FopCustomersTable = ({ customers, isLoading, callback, accountId }: IProps) => {
  const [editedCustomer, setEditedCustomer] = useState<IFOPCustomer | null>(null);
  const [deletedCustomer, setDeletedCustomer] = useState<IFOPCustomer | null>(null);

  const columns: ColumnDef<IFOPCustomer>[] = [
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
        <DeleteFopCustomer
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
          accountId={accountId}
        />
      )}
      <DataTable
        title="Current active customers"
        data={customers}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-5"
        rowKey={(c) => c.id}
        getRowHref={(c) => `/account/${accountId}/fop/customers/${c.id}`}
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(c) => c.name}
      />
    </>
  );
};

export default FopCustomersTable;
