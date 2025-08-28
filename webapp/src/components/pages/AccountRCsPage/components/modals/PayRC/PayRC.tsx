import { useRef, useState, useCallback } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IRC } from '@/types';

import PayForm, { PayFormRef } from './components/PayForm/PayForm';

interface IProps {
  rc: IRC;
  handleClose: () => void;
  callback: () => void;
}

const PayRC = ({ rc, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<PayFormRef>(null);

  const toggleIsDisabled = useCallback((value: boolean) => {
    setIsDisabled(value);
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={isDisabled}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={() => formRef.current?.submitForm()}
      primaryButtonText="Pay"
      secondaryButtonText="Cancel"
      title={`Pay for ${rc.name}`}
      text="Select the date for what payment is made and confirm payment details."
      confirmBeforePrimaryAction={true}
      confirmTitle={
        rc.isPermanentAmount
          ? 'Are you sure you want to confirm this payment?'
          : 'Are you sure you want to confirm this payment? The monthly estimated amount will be updated based on this payment for future cost predictions.'
      }
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <>
        {isLoading && (
          <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
            <Loader />
          </div>
        )}
        {rc && (
          <PayForm
            ref={formRef}
            rc={rc}
            toggleIsDisabled={toggleIsDisabled}
            callback={() => {
              setIsLoading(true);
              callback();
              handleClose();
            }}
          />
        )}
      </>
    </FullScreenModal>
  );
};

export default PayRC;
