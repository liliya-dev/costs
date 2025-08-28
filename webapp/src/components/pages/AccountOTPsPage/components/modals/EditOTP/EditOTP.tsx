import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IOTP } from '@/types';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  otp: IOTP;
  handleClose: () => void;
  callback: () => void;
  accountId: number;
}

const EditOTP = ({ otp, handleClose, callback, accountId }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<EditFormRef>(null);

  const toggleIsDisabled = useCallback((value: boolean) => {
    setIsDisabled(value);
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={isDisabled}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={() => formRef.current?.submitForm()}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      title="Edit this one-time payment"
      text="You can edit the details of this one-time payment below."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        accountId={accountId}
        ref={formRef}
        otp={otp}
        toggleIsDisabled={toggleIsDisabled}
        callback={() => {
          callback();
          handleClose();
        }}
      />
    </FullScreenModal>
  );
};

export default EditOTP;
