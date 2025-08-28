import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IRC } from '@/types';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  rc: IRC;
  handleClose: () => void;
  callback: () => void;
  accountId: number;
}

const EditRC = ({ rc, handleClose, callback, accountId }: IProps) => {
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
      title="Edit this recurring cost"
      text="You can edit recurring cost details. Please note that changing permanent amount will affect future cost predictions."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        accountId={accountId}
        ref={formRef}
        rc={rc}
        toggleIsDisabled={toggleIsDisabled}
        callback={() => {
          callback();
          handleClose();
        }}
      />
    </FullScreenModal>
  );
};

export default EditRC;
