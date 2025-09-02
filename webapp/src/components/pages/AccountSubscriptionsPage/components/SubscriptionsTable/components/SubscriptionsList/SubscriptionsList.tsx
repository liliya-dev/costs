import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols, SubscriptionsStatusColors, SubscriptionsStatusTypes } from '@/constants';
import { ISubscription } from '@/types';

interface IProps {
  subscriptions: ISubscription[];
  handleOpenEditSubscription: (subscription: ISubscription) => void;
  handleOpenDeleteSubscription: (subscription: ISubscription) => void;
  handleOpenPauseSubscription: (subscription: ISubscription) => void;
  accountId: number;
  isLoading: boolean;
}

const SubscriptionsList = ({
  subscriptions,
  handleOpenDeleteSubscription,
  handleOpenEditSubscription,
  handleOpenPauseSubscription,
  accountId,
  isLoading,
}: IProps) => {
  return (
    <>
      {subscriptions.map(
        (
          {
            monthlyPayment,
            currency,
            description,
            approximatelyPaymentDay,
            tags,
            name,
            isCancelled,
            id,
          },
          index,
        ) => (
          <div
            key={id}
            className={`grid grid-cols-3 sm:grid-cols-6 ${
              index === subscriptions.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
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
              {tags.map((item) => (
                <Tag key={item.id} label={item.name} color={item.color} />
              ))}
            </TableRow>
            <TableRow>
              <div className="flex w-full justify-end">
                <IconButton
                  iconHeight={18}
                  iconColor="LIGHT"
                  icon={isCancelled ? 'Play' : 'Pause'}
                  onClick={() => handleOpenPauseSubscription(subscriptions[index])}
                />
                <div className="ml-4" />
                <IconButton
                  iconHeight={24}
                  iconColor="LIGHT"
                  icon="Edit"
                  onClick={() => handleOpenEditSubscription(subscriptions[index])}
                />
                <div className="ml-4" />
                <IconButton
                  iconHeight={24}
                  iconColor="RED"
                  icon="Trash"
                  onClick={() => handleOpenDeleteSubscription(subscriptions[index])}
                />
              </div>
            </TableRow>
          </div>
        ),
      )}
      {!subscriptions.length && !isLoading && (
        <div className="bg-white px-6 py-12">
          <p className="text-center text-lg">There are no subscriptions yet</p>
        </div>
      )}
    </>
  );
};

export default SubscriptionsList;
