'use client';
import { useState, useEffect } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import { ICustomer } from '@/types';
import { getCustomers } from '@/utils/api';

import AddCustomerForm from './components/AddCustomerForm/AddCustomerForm';
import CustomersTable from './components/CustomersTable/CustomersTable';

interface IProps {
  accountId: number;
}

const AccountCustomersPage = ({ accountId }: IProps) => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [isLoading, setIsInitialDataLoading] = useState(true);

  const getData = async () => {
    setIsInitialDataLoading(true);
    const res = await getCustomers(accountId);
    if (res.data) {
      setCustomers(res.data);
    }
    setIsInitialDataLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <CustomersTable
            accountId={accountId}
            customers={customers}
            callback={getData}
            isLoading={isLoading}
          />
          <AddCustomerForm accountId={accountId} callback={getData} />
        </>
      )}
    </>
  );
};

export default AccountCustomersPage;
