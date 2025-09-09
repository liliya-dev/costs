'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IFOPCustomer } from '@/types';
import { getFopCustomer } from '@/utils/api';

import FopCustomerDetails from './components/FopCustomerDetails';

interface IProps {
  customerId: number;
}

const FopCustomersPage = ({ customerId }: IProps) => {
  const [customer, setCustomer] = useState<IFOPCustomer>();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    const res = await getFopCustomer(customerId);
    if (res.data) setCustomer(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <Loader />;
  if (!customer) return <p className="text-red-500">Customer not found</p>;

  return (
    <div className="space-y-6">
      <TableTitle title={customer.name} />
      <FopCustomerDetails customer={customer} />
    </div>
  );
};

export default FopCustomersPage;
