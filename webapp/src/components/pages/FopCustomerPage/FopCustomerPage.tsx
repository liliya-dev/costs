'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IFOPCustomer } from '@/types';
import { getFopCustomer } from '@/utils/api';

import FopCustomerDetails from './components/FopCustomerDetails';
import InvoicesList from './components/InvoicesList';

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
    <div className="">
      <TableTitle title={customer.name} />
      <FopCustomerDetails customer={customer} />
      <InvoicesList invoices={customer.invoices} />
    </div>
  );
};

export default FopCustomersPage;
