import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IOTP } from '@/types';
import { deleteOTP } from '@/utils/api';

interface IProps {
  otp: IOTP;
  handleClose: () => void;
  callback: () => void;
}

const DeleteOTP = ({ otp, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteOTP = useCallback(async () => {
    setIsLoading(true);
    await deleteOTP(otp.id);
    setIsLoading(false);
    callback();
    handleClose();
  }, [otp, callback, handleClose]);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteOTP}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title={`Delete OTP - ${otp.name}`}
      text={
        <>
          <strong>Please note:</strong> Deleting this outgoing transaction is permanent and will
          result in the complete loss of all information related to this item.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to delete OTP "${otp.name}"?`}
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

export default DeleteOTP;
