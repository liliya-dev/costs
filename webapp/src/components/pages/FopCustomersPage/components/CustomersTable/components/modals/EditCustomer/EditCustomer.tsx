import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IFOPCustomer } from '@/types/general/fop-customer';

import EditForm, { EditFopFormRef } from './components/EditForm/EditForm';

interface IProps {
  customer: IFOPCustomer;
  handleClose: () => void;
  callback: () => void;
  accountId: number;
}

const EditCustomer = ({ customer, handleClose, callback, accountId }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<EditFopFormRef>(null);

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
      title="Edit customer details"
      text="Based on the information provided, related payments for this transaction will also be updated."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        ref={formRef}
        customer={customer}
        toggleIsDisabled={toggleIsDisabled}
        callback={() => {
          callback();
          handleClose();
        }}
        accountId={accountId}
      />
    </FullScreenModal>
  );
};

export default EditCustomer;
