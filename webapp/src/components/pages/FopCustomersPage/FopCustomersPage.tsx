'use client';
import { useState, useEffect } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import { IFOPCustomer } from '@/types';
import { getFopCustomersByAccountId } from '@/utils/api';

import FopCustomersTable from './components/CustomersTable/FopCustomersTable';

interface IProps {
  accountId: number;
}

const FopCustomersPage = ({ accountId }: IProps) => {
  const [fopCustomers, setFopCustomers] = useState<IFOPCustomer[]>([]);
  const [isLoading, setIsInitialDataLoading] = useState(true);

  const getData = async () => {
    setIsInitialDataLoading(true);
    const res = await getFopCustomersByAccountId(accountId);
    if (res.data) {
      setFopCustomers(res.data);
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
        <FopCustomersTable
          accountId={accountId}
          customers={fopCustomers}
          callback={getData}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default FopCustomersPage;
