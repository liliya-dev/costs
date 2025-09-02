import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { ISubscription } from '@/types';

import DeleteSubscription from '../modals/DeleteSubscription/DeleteSubscription';
import EditSubscription from '../modals/EditSubscription/EditSubscription';
import PauseSubscription from '../modals/PauseSubscription/PauseSubscription';

import SubscriptionsList from './components/SubscriptionsList/SubscriptionsList';

interface IProps {
  subscriptions: ISubscription[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = ['Name', 'Payment', 'Payment day', 'Description', 'Tags', ''];

const SubscriptionsTable = ({ subscriptions, isLoading, callback, accountId }: IProps) => {
  const [pausedSubscription, setPausedSubscription] = useState<ISubscription | null>(null);
  const [editedSubscription, setEditedSubscription] = useState<ISubscription | null>(null);
  const [deletedSubscription, setDeletedSubscription] = useState<ISubscription | null>(null);

  const handleOpenPauseSubscription = useCallback((subscription: ISubscription) => {
    setPausedSubscription(subscription);
  }, []);

  const handleClosePauseSubscription = useCallback(() => {
    setPausedSubscription(null);
  }, []);

  const handleOpenEditSubscription = useCallback((subscription: ISubscription) => {
    setEditedSubscription(subscription);
  }, []);

  const handleCloseEditSubscription = useCallback(() => {
    setEditedSubscription(null);
  }, []);

  const handleOpenDeleteSubscription = useCallback((subscription: ISubscription) => {
    setDeletedSubscription(subscription);
  }, []);

  const handleCloseDeleteSubscription = useCallback(() => {
    setDeletedSubscription(null);
  }, []);

  return (
    <>
      {deletedSubscription && (
        <DeleteSubscription
          callback={callback}
          subscription={deletedSubscription}
          handleClose={handleCloseDeleteSubscription}
        />
      )}
      {editedSubscription && (
        <EditSubscription
          accountId={accountId}
          subscription={editedSubscription}
          callback={callback}
          handleClose={handleCloseEditSubscription}
        />
      )}
      {pausedSubscription && (
        <PauseSubscription
          subscription={pausedSubscription}
          callback={callback}
          handleClose={handleClosePauseSubscription}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Current active subscriptions" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {headers.map((item) => (
              <TableHeader key={item} title={item} />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <SubscriptionsList
              isLoading={isLoading}
              subscriptions={subscriptions}
              accountId={accountId}
              handleOpenEditSubscription={handleOpenEditSubscription}
              handleOpenDeleteSubscription={handleOpenDeleteSubscription}
              handleOpenPauseSubscription={handleOpenPauseSubscription}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionsTable;
