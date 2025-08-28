import { useState, useCallback } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { ICustomer } from '@/types';

import DeleteCustomer from '../modals/DeleteCustomer/DeleteCustomer';
import EditCustomer from '../modals/EditCustomer/EditCustomer';
import PauseCustomer from '../modals/PauseCustomer/PauseCustomer';

import CustomersList from './components/CustomersList/CustomersList';

interface IProps {
  customers: ICustomer[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = [
  'Name',
  'Amount per month',
  'Currency',
  'Form of payment',
  'Approximately payment day',
];

const CustomersTable = ({ customers, isLoading, callback, accountId }: IProps) => {
  const [pausedCustomer, setPausedCustomer] = useState<ICustomer | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<ICustomer | null>(null);
  const [deletedCustomer, setDeletedCustomer] = useState<ICustomer | null>(null);

  const handleOpenPauseCustomer = useCallback((customer: ICustomer) => {
    setPausedCustomer(customer);
  }, []);

  const handleClosePauseCustomer = useCallback(() => {
    setPausedCustomer(null);
  }, []);

  const handleOpenEditCustomer = useCallback((customer: ICustomer) => {
    setEditedCustomer(customer);
  }, []);

  const handleCloseEditCustomer = useCallback(() => {
    setEditedCustomer(null);
  }, []);

  const handleOpenDeleteCustomer = useCallback((customer: ICustomer) => {
    setDeletedCustomer(customer);
  }, []);

  const handleCloseDeleteCustomer = useCallback(() => {
    setDeletedCustomer(null);
  }, []);

  return (
    <>
      {deletedCustomer && (
        <DeleteCustomer
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
        />
      )}
      {pausedCustomer && (
        <PauseCustomer
          customer={pausedCustomer}
          callback={callback}
          handleClose={handleClosePauseCustomer}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Current active customers" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {headers.map((item) => (
              <TableHeader key={item} title={item} />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <CustomersList
              accountId={accountId}
              customers={customers}
              handleOpenEditCustomer={handleOpenEditCustomer}
              handleOpenDeleteCustomer={handleOpenDeleteCustomer}
              handleOpenPauseCustomer={handleOpenPauseCustomer}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustomersTable;
