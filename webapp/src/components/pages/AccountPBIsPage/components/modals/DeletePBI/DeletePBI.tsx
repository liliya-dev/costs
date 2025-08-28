import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IPBI } from '@/types';
import { deletePBI } from '@/utils/api';

interface IProps {
  pbi: IPBI;
  handleClose: () => void;
  callback: () => void;
}

const DeletePBI = ({ pbi, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteSubscription = useCallback(async () => {
    setIsLoading(true);
    await deletePBI(pbi.id);
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
      title={`Delete ${pbi.name} payments by installments`}
      text={
        <>
          <strong>Please note:</strong> Deleting this payments by installments will also remove all
          associated payments, which may affect your monthly financial data. Deletion is permanent
          and will result in the complete loss of all information related to this item.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to delete payment by installments for ${pbi.name}`}
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

export default DeletePBI;
