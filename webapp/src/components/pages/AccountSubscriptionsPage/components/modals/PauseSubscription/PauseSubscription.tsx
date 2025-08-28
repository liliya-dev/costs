import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ISubscription } from '@/types';
import { updateSubscription } from '@/utils/api';

interface IProps {
  subscription: ISubscription;
  handleClose: () => void;
  callback: () => void;
}

const PauseSubscription = ({ subscription, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePauseSubscription = useCallback(async () => {
    setIsLoading(true);
    await updateSubscription(subscription.id, {
      isCancelled: !subscription.isCancelled,
    });
    setIsLoading(false);
    callback();
    handleClose();
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handlePauseSubscription}
      primaryButtonText={subscription.isCancelled ? 'Renew' : 'Pause'}
      secondaryButtonText="Cancel"
      title={`Pause ${subscription.name} subscription`}
      text={
        subscription.isCancelled
          ? 'If you resume this subscription, recurring payments will be charged automatically again, and the subscription amount will be included in your monthly expenses.'
          : 'If you pause this subscription, recurring payments will no longer be charged automatically, and the subscription amount will no longer be included in your monthly expenses.'
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to pause ${subscription.name} subscription`}
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <>
        {isLoading && (
          <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
            <Loader />
          </div>
        )}
      </>
    </FullScreenModal>
  );
};

export default PauseSubscription;
