import { ISubscription, ITag } from '@/types';

import EmptySubscriptions from './EmptySubscriptions';
import SubscriptionRow from './SubscriptionRow';

interface IProps {
  subscriptions: ISubscription[];
  handleOpenEditSubscription: (subscription: ISubscription) => void;
  handleOpenDeleteSubscription: (subscription: ISubscription) => void;
  handleOpenPauseSubscription: (subscription: ISubscription) => void;
  onTagClick: (tag: ITag) => void;
  accountId: number;
  isLoading: boolean;
}

const SubscriptionsList = ({
  subscriptions,
  handleOpenDeleteSubscription,
  handleOpenEditSubscription,
  handleOpenPauseSubscription,
  onTagClick,
  accountId,
  isLoading,
}: IProps) => {
  if (!subscriptions.length && !isLoading) {
    return <EmptySubscriptions />;
  }

  return (
    <>
      {subscriptions.map((subscription, index) => (
        <SubscriptionRow
          key={subscription.id}
          subscription={subscription}
          index={index}
          total={subscriptions.length}
          accountId={accountId}
          onPause={handleOpenPauseSubscription}
          onEdit={handleOpenEditSubscription}
          onDelete={handleOpenDeleteSubscription}
          onTagClick={onTagClick}
        />
      ))}
    </>
  );
};

export default SubscriptionsList;
