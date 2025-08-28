import { useCallback, useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';

import AddForm, { AddFormRef } from './components/AddForm/AddForm';

interface IProps {
  accountId: number;
  callback: () => void;
}

const AddOTP = ({ accountId, callback }: IProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<AddFormRef>(null);

  const toggleIsDisabled = useCallback((value: boolean) => {
    setIsDisabled(value);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpened(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpened(true);
  }, []);

  const handleSuccessfulCreation = useCallback(() => {
    closeModal();
    callback();
  }, [callback, closeModal]);

  return (
    <div className="flex w-full justify-end">
      <Button type="SUCESS" title="Add new" onClick={openModal} />
      {isOpened && (
        <FullScreenModal
          isPrimaryButtonDisabled={isDisabled}
          onClose={closeModal}
          onSecondaryButtonClick={closeModal}
          onPrimaryButtonClick={() => formRef.current?.submitForm()}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          title="Add new Outgoing Transaction"
          text="Fill out the form to create a new outgoing transaction."
          confirmBeforePrimaryAction={true}
          confirmTitle="Are you sure you want to save this transaction?"
          confirmText="Yes"
          cancelConfirmText="No"
        >
          <AddForm
            accountId={accountId}
            ref={formRef}
            toggleIsDisabled={toggleIsDisabled}
            callback={handleSuccessfulCreation}
          />
        </FullScreenModal>
      )}
    </div>
  );
};

export default AddOTP;
