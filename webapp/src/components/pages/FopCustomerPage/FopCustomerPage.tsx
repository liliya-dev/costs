'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IFOPCustomer } from '@/types';
import { createAct, createInvoice, deleteInvoice, getFopCustomer } from '@/utils/api';

import FopCustomerDetails from './components/FopCustomerDetails';
import InvoicesList from './components/InvoicesList';

interface IProps {
  customerId: number;
}

const FopCustomersPage = ({ customerId }: IProps) => {
  const [customer, setCustomer] = useState<IFOPCustomer>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customer?.name) {
      document.title = `${customer.name} | FOP Customers`;
    }
  }, [customer]);

  const getData = async () => {
    setIsLoading(true);
    const res = await getFopCustomer(customerId);
    if (res.data) setCustomer(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleteInvoice = async (id: number) => {
    setIsLoading(true);
    await deleteInvoice(id);
    getData();
  };

  const generateInvoice = async () => {
    setIsLoading(true);
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const invoiceRes = await createInvoice({ day, month, year, customerId: +customerId });
    if (invoiceRes.data?.id) {
      const actRes = await createAct({ day, month, year, invoiceId: invoiceRes.data.id });
      if (actRes.data?.id) {
        getData();
      }
    }
  };

  if (isLoading) return <Loader />;
  if (!customer) return <p className="text-red-500">Customer not found</p>;
  return (
    <div className="">
      <Head>
        <title>{customer?.name} | FOP Customer</title>
      </Head>
      <div className="flex items-center justify-between">
        <TableTitle title={customer.name} />
        <Button title="Generate current invoice" type="DARK" onClick={generateInvoice} />
      </div>
      <FopCustomerDetails customer={customer} />
      <InvoicesList invoices={customer.invoices} handleDeleteInvoice={handleDeleteInvoice} />
    </div>
  );
};

export default FopCustomersPage;
