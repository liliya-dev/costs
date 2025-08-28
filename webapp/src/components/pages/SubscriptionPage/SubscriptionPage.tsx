'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { ISubscriptionWithTransactions } from '@/types';
import { getSubscriptionById } from '@/utils/api';

import TransactionsTable from './components/TransactionsTable/TransactionsTable';

interface IProps {
  accountId: number;
  subscriptionId: number;
}

const SubscriptionPage = ({ subscriptionId }: IProps) => {
  const [subscription, setSubscription] = useState<ISubscriptionWithTransactions>();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    const res = await getSubscriptionById(subscriptionId);
    if (res.data) {
      setSubscription(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && subscription && (
        <>
          <TableTitle title={`${subscription.name} subscription`} />
          <TransactionsTable transactions={subscription.transactions} />
        </>
      )}
    </div>
  );
};

export default SubscriptionPage;
