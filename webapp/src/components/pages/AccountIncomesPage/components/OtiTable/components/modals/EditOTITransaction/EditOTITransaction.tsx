import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IOTI } from '@/types';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  oti: IOTI;
  handleClose: () => void;
  callback: () => void;
}

const EditOTITransaction = ({ handleClose, callback, oti }: IProps) => {
  const formRef = useRef<EditFormRef>(null);
  const [isDisabled, setIsDisabled] = useState(true);

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
      title="Edit transaction"
      text="Based on the information provided this one time payment will be updated."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        ref={formRef}
        oti={oti}
        callback={() => {
          callback();
          handleClose();
        }}
        toggleIsDisabled={toggleIsDisabled}
      />
    </FullScreenModal>
  );
};

export default EditOTITransaction;
