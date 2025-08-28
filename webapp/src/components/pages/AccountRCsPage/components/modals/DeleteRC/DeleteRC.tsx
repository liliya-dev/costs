import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IRC } from '@/types';
import { deleteRC } from '@/utils/api';

interface IProps {
  rc: IRC;
  handleClose: () => void;
  callback: () => void;
}

const DeleteRC = ({ rc, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRC = useCallback(async () => {
    setIsLoading(true);
    await deleteRC(rc.id);
    setIsLoading(false);
    callback();
    handleClose();
  }, [rc.id, callback, handleClose]);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={isLoading}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteRC}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title={`Delete regular cost: ${rc.name}`}
      text={
        <>
          <strong>Please note:</strong> Deleting this regular cost will also remove all associated
          transactions, which may affect your future and previous cost predictions and monthly
          analytics. This action is permanent and cannot be undone.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to delete the recurring cost "${rc.name}"?`}
      confirmText="Yes"
      cancelConfirmText="No"
    >
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
    </FullScreenModal>
  );
};

export default DeleteRC;
