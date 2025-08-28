import { useCallback, useEffect, useRef, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ICustomer, ITransaction } from '@/types';
import { getTransaction } from '@/utils/api';

import EditForm, { EditFormRef } from './components/EditForm/EditForm';

interface IProps {
  transactionId: number;
  customers: ICustomer[];
  handleClose: () => void;
  callback: () => void;
}

const EditIRPTransaction = ({ transactionId, customers, handleClose, callback }: IProps) => {
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formRef = useRef<EditFormRef>(null);

  const toggleIsDisabled = useCallback((value: boolean) => {
    setIsDisabled(value);
  }, []);

  const getTransactionData = async () => {
    setIsLoading(true);
    const res = await getTransaction(transactionId);
    if (res.data) {
      setTransaction(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTransactionData();
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
      text="Based on the information provided, related payments for this transaction will also be updated."
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to save changes?"
      confirmText="Yes"
      cancelConfirmText="No"
    >
      <>
        {isLoading && (
          <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
            <Loader />
          </div>
        )}
        {transaction && (
          <EditForm
            ref={formRef}
            transaction={transaction}
            customers={customers}
            toggleIsDisabled={toggleIsDisabled}
            callback={() => {
              callback();
              handleClose();
            }}
          />
        )}
      </>
    </FullScreenModal>
  );
};

export default EditIRPTransaction;
