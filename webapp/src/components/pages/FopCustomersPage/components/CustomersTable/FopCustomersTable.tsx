import { useState, useCallback } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IFOPCustomer } from '@/types';

import FopCustomersList from './components/CustomersList/FopCustomersList';
import DeleteFopCustomer from './components/modals/DeleteFopCustomer/DeleteFopCustomer';
import EditCustomer from './components/modals/EditCustomer/EditCustomer';

interface IProps {
  customers: IFOPCustomer[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = ['Name', 'Amount per month', 'Currency', 'Approximately payment day'];

const FopCustomersTable = ({ customers, isLoading, callback, accountId }: IProps) => {
  const [editedCustomer, setEditedCustomer] = useState<IFOPCustomer | null>(null);
  const [deletedCustomer, setDeletedCustomer] = useState<IFOPCustomer | null>(null);

  const handleOpenEditCustomer = useCallback((customer: IFOPCustomer) => {
    setEditedCustomer(customer);
  }, []);

  const handleCloseEditCustomer = useCallback(() => {
    setEditedCustomer(null);
  }, []);

  const handleOpenDeleteCustomer = useCallback((customer: IFOPCustomer) => {
    setDeletedCustomer(customer);
  }, []);

  const handleCloseDeleteCustomer = useCallback(() => {
    setDeletedCustomer(null);
  }, []);

  return (
    <>
      {deletedCustomer && (
        <DeleteFopCustomer
          callback={callback}
          customer={deletedCustomer}
          handleClose={handleCloseDeleteCustomer}
        />
      )}
      {editedCustomer && (
        <EditCustomer
          customer={editedCustomer}
          callback={callback}
          handleClose={handleCloseEditCustomer}
          accountId={accountId}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Current active customers" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-5">
            {headers.map((item) => (
              <TableHeader key={item} title={item} />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <FopCustomersList
              accountId={accountId}
              customers={customers}
              handleOpenEditCustomer={handleOpenEditCustomer}
              handleOpenDeleteCustomer={handleOpenDeleteCustomer}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FopCustomersTable;
