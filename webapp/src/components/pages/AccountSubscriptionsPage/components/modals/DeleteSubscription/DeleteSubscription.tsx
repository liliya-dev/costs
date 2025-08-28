import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ISubscription } from '@/types';
import { deleteSubscription } from '@/utils/api';

interface IProps {
  subscription: ISubscription;
  handleClose: () => void;
  callback: () => void;
}

const DeleteSubscription = ({ subscription, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteSubscription = useCallback(async () => {
    setIsLoading(true);
    await deleteSubscription(subscription.id);
    setIsLoading(false);
    callback();
    handleClose();
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteSubscription}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title={`Delete ${subscription.name} subscription`}
      text={
        <>
          <strong>Please note:</strong> Deleting a subscription will also remove all associated
          payments, which may affect your monthly financial data. If you’re not using the
          subscription temporarily, it’s recommended to pause it instead. Deletion is permanent and
          will result in the complete loss of all information related to this subscription.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to delete ${subscription.name} subscription`}
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

export default DeleteSubscription;
