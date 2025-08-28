import { useCallback, useRef, useState } from 'react';

import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IPBI } from '@/types';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  pbi: IPBI;
  handleClose: () => void;
  callback: () => void;
  accountId: number;
}

const EditPBI = ({ pbi, handleClose, callback, accountId }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<EditFormRef>(null);

  const newPbiText =
    'Based on the information provided, related payments for this payment by installments will also be updated.';
  const startedPbiText =
    'Unfortunately, you can’t edit the payment details for this installment plan since the first payment has already been made. However, you can still update the general information.';

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
      title="Edit this payment by installments"
      text={pbi.transactions.length ? startedPbiText : newPbiText}
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <EditForm
        accountId={accountId}
        ref={formRef}
        pbi={pbi}
        toggleIsDisabled={toggleIsDisabled}
        callback={() => {
          callback();
          handleClose();
        }}
        arePaymentFieldsDisabled={pbi.transactions.length !== 0}
      />
    </FullScreenModal>
  );
};

export default EditPBI;
