import { ISubscription, ITag } from '@/types';

import EmptySubscriptions from './EmptySubscriptions';
import SubscriptionRow from './SubscriptionRow';

interface IProps {
  subscriptions: ISubscription[];
  handleOpenEditSubscription: (subscription: ISubscription) => void;
  handleOpenDeleteSubscription: (subscription: ISubscription) => void;
  handleOpenPauseSubscription: (subscription: ISubscription) => void;
  handleUpdateSelectedTags: (tag: ITag) => void;
  accountId: number;
  isLoading: boolean;
  selectedTags: ITag[];
}

const SubscriptionsList = ({
  subscriptions,
  handleOpenDeleteSubscription,
  handleOpenEditSubscription,
  handleOpenPauseSubscription,
  handleUpdateSelectedTags,
  accountId,
  isLoading,
  selectedTags,
}: IProps) => {
  const filteredSubscriptions =
    selectedTags.length > 0
      ? subscriptions.filter((sub) =>
          selectedTags.every((selectedTag) => sub.tags.some((tag) => tag.id === selectedTag.id)),
        )
      : subscriptions;

  if (!filteredSubscriptions.length && !isLoading) {
    return <EmptySubscriptions />;
  }

  return (
    <>
      {filteredSubscriptions.map((subscription, index) => (
        <SubscriptionRow
          key={subscription.id}
          subscription={subscription}
          index={index}
          total={filteredSubscriptions.length}
          accountId={accountId}
          onPause={handleOpenPauseSubscription}
          onEdit={handleOpenEditSubscription}
          onDelete={handleOpenDeleteSubscription}
          onTagClick={handleUpdateSelectedTags}
        />
      ))}
    </>
  );
};

export default SubscriptionsList;
