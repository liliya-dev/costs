import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import { currencySymbols, SubscriptionsStatusColors, SubscriptionsStatusTypes } from '@/constants';
import { ISubscription, ITag } from '@/types';

import SubscriptionTags from './SubscriptionTags';

interface IProps {
  subscription: ISubscription;
  index: number;
  total: number;
  accountId: number;
  onPause: (subscription: ISubscription) => void;
  onEdit: (subscription: ISubscription) => void;
  onDelete: (subscription: ISubscription) => void;
  onTagClick: (tag: ITag) => void;
}

const SubscriptionRow = ({
  subscription,
  index,
  total,
  accountId,
  onPause,
  onEdit,
  onDelete,
  onTagClick,
}: IProps) => {
  const {
    id,
    name,
    monthlyPayment,
    currency,
    approximatelyPaymentDay,
    description,
    isCancelled,
    tags,
  } = subscription;

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-6 ${
        index === total - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <Link href={`/account/${accountId}/costs/subscriptions/${id}`} className="contents">
        <TableRow>
          <div className="flex">
            <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: isCancelled
                    ? SubscriptionsStatusColors[SubscriptionsStatusTypes.INACTIVE]
                    : SubscriptionsStatusColors[SubscriptionsStatusTypes.ACTIVE],
                }}
              />
            </div>
            <p className="font-medium">{name}</p>
          </div>
        </TableRow>
        <TableRow>
          {monthlyPayment} {currencySymbols[currency]}
        </TableRow>
        <TableRow>{approximatelyPaymentDay}</TableRow>
        <TableRow>{description}</TableRow>
      </Link>
      <TableRow>
        <SubscriptionTags tags={tags} onTagClick={onTagClick} />
      </TableRow>
      <TableRow>
        <div className="flex w-full justify-end">
          <IconButton
            iconHeight={18}
            iconColor="LIGHT"
            icon={isCancelled ? 'Play' : 'Pause'}
            onClick={() => onPause(subscription)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => onEdit(subscription)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => onDelete(subscription)}
          />
        </div>
      </TableRow>
    </div>
  );
};

export default SubscriptionRow;
