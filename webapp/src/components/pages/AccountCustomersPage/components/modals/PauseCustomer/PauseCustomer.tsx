import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ICustomer } from '@/types';
import { updateCustomer } from '@/utils/api';

interface IProps {
  customer: ICustomer;
  handleClose: () => void;
  callback: () => void;
}

const PauseCustomer = ({ customer, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePauseCustomer = useCallback(async () => {
    setIsLoading(true);
    await updateCustomer(customer.id, {
      isCancelled: !customer.isCancelled,
    });
    setIsLoading(false);
    callback();
    handleClose();
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handlePauseCustomer}
      primaryButtonText={customer.isCancelled ? 'Renew' : 'Pause'}
      secondaryButtonText="Cancel"
      title={`Pause the customer ${customer.name}`}
      text={
        customer.isCancelled
          ? 'If you resume this customer, its payments will be included in your monthly expenses.'
          : 'If you pause this customer, payments will no longer be included in your monthly expenses'
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to pause the customer ${customer.name} `}
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

export default PauseCustomer;
