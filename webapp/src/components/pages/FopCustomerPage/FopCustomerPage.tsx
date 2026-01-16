'use client';

import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IFOPCustomer, IFOPInvoice, InvoiceStatus } from '@/types';
import {
  createAct,
  createInvoice,
  deleteInvoice,
  getFopCustomer,
  updateInvoiceStatus,
} from '@/utils/api';

import FopCustomerDetails from './components/FopCustomerDetails';
import InvoicesList from './components/InvoicesList';

interface IProps {
  customerId: number;
}

const FopCustomersPage = ({ customerId }: IProps) => {
  const [customer, setCustomer] = useState<IFOPCustomer>();
  const [invoiceToPay, setInvoiceToPay] = useState<IFOPInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleSetPayInvoice = (invoice: IFOPInvoice) => setInvoiceToPay(invoice);
  const handleCancelPayInvoice = () => setInvoiceToPay(null);

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

  const handleUpdateInvoiceStatus = useCallback(async () => {
    if (!invoiceToPay) return;
    setIsLoading(true);
    const res = await updateInvoiceStatus(invoiceToPay.id, InvoiceStatus.PAID);
    if (res.data) {
      getData();
      setInvoiceToPay(null);
    }
  }, [invoiceToPay]);

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
      {invoiceToPay && (
        <FullScreenModal
          title={`${invoiceToPay.name}`}
          text={`Are you sure you want to mark the ${invoiceToPay.name} invoice as paid?`}
          onPrimaryButtonClick={handleUpdateInvoiceStatus}
          onSecondaryButtonClick={handleCancelPayInvoice}
          primaryButtonText="Yes"
          secondaryButtonText="Cancel"
          onClose={handleCancelPayInvoice}
        >
          <>
            {isLoading && (
              <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
                <Loader />
              </div>
            )}
          </>
        </FullScreenModal>
      )}
      <div className="flex items-center justify-between">
        <TableTitle title={customer.name} />
        <Button title="Generate current invoice" type="DARK" onClick={generateInvoice} />
      </div>
      <FopCustomerDetails customer={customer} />
      <InvoicesList
        handleSetPayInvoice={handleSetPayInvoice}
        invoices={customer.invoices}
        handleDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
};

export default FopCustomersPage;
