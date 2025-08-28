import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ISubscription } from '@/types';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  subscription: ISubscription;
  handleClose: () => void;
  callback: () => void;
  accountId: number;
}

const EditSubscription = ({ subscription, handleClose, callback, accountId }: IProps) => {
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
      title="Edit subscription details"
      text="Based on the information provided, the subscription info will be updated."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        accountId={accountId}
        ref={formRef}
        subscription={subscription}
        toggleIsDisabled={toggleIsDisabled}
        callback={() => {
          callback();
          handleClose();
        }}
      />
    </FullScreenModal>
  );
};

export default EditSubscription;
