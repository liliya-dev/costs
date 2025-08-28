'use client';

import { useEffect, useMemo, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols } from '@/constants';
import { Currency, ICustomerWithPayments } from '@/types';
import { getCustomerById } from '@/utils/api';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import TransactionsTable from './components/TransactionsTable/TransactionsTable';

interface IProps {
  customerId: number;
}

const CustomerPage = ({ customerId }: IProps) => {
  const [customer, setCustomer] = useState<ICustomerWithPayments>();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    const res = await getCustomerById(customerId);
    if (res.data) {
      setCustomer(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const totalReceivedInEUR = useMemo(() => {
    if (!customer) return 0;
    return customer.payments.reduce((sum, payment) => {
      return (
        sum +
        convertAmountToCurrency({
          amount: payment.amount,
          currency: payment.currency,
          rateUahToEur: payment.rateUahToEur,
          rateUahToUsd: payment.rateUahToUsd,
          selectedCurrency: Currency.EUR,
        })
      );
    }, 0);
  }, [customer]);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && customer && (
        <>
          <TableTitle title={`${customer.name} payments info`} />
          <div className="my-6 space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">Onboarded:</span> {formatDate(customer.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Monthly payment:</span> {customer.monthlyPayment}{' '}
              {customer.currency.toUpperCase()}
            </p>
            <p>
              <span className="font-semibold">Approx. payment day:</span>{' '}
              {customer.approximatelyPaymentDay}
            </p>
            <p>
              <span className="font-semibold">Total received:</span> {totalReceivedInEUR}{' '}
              {currencySymbols[Currency.EUR]}
            </p>
          </div>
          <TransactionsTable payments={customer.payments} />
        </>
      )}
    </div>
  );
};

export default CustomerPage;
