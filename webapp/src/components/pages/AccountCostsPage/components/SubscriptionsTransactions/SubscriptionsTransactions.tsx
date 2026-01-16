import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { ISubscriptionTransaction, Currency, ITag } from '@/types';

import SubscriptionsTransactionsEmpty from './components/SubscriptionsTransactionsEmpty';
import SubscriptionsTransactionsHeader from './components/SubscriptionsTransactionsHeader';
import SubscriptionsTransactionsRow from './components/SubscriptionsTransactionsRow';

interface IProps {
  accountId: number;
  subscriptions: ISubscriptionTransaction[];
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const SubscriptionsTransactions = ({
  subscriptions,
  accountId,
  selectedCurrency,
  onTagClick,
}: IProps) => {
  return (
    <div>
      <div className="mt-4 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Subscriptions payments" />
        </div>
        <SubscriptionsTransactionsHeader selectedCurrency={selectedCurrency} />

        {subscriptions.length ? (
          subscriptions.map((subscription, index) => (
            <SubscriptionsTransactionsRow
              key={subscription.subscriptionId}
              subscription={subscription}
              accountId={accountId}
              isLast={index === subscriptions.length - 1}
              selectedCurrency={selectedCurrency}
              onTagClick={onTagClick}
            />
          ))
        ) : (
          <SubscriptionsTransactionsEmpty />
        )}
      </div>
    </div>
  );
};

export default SubscriptionsTransactions;
