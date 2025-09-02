'use client';

import { useState, useCallback, useEffect } from 'react';

import { ISubscription } from '@/types';
import { getSubscriptionsByAccountId } from '@/utils/api';

import AddSubscription from './components/AddSubscription/AddSubscription';
import SubscriptionsTable from './components/SubscriptionsTable/SubscriptionsTable';

interface IProps {
  accountId: number;
}

const AccountSubscriptionsPage = ({ accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    const res = await getSubscriptionsByAccountId(accountId);
    if (res.data) {
      setSubscriptions(res.data);
    }
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div>
      <AddSubscription accountId={accountId} callback={fetchSubscriptions} />
      <SubscriptionsTable
        isLoading={isLoading}
        subscriptions={subscriptions}
        callback={fetchSubscriptions}
        accountId={accountId}
      />
    </div>
  );
};

export default AccountSubscriptionsPage;
