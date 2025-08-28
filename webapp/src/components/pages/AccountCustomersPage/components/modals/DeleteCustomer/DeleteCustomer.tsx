import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { ICustomer } from '@/types';
import { deleteCustomer } from '@/utils/api';

interface IProps {
  customer: ICustomer;
  handleClose: () => void;
  callback: () => void;
}

const DeleteCustomer = ({ customer, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteCustomer = useCallback(async () => {
    setIsLoading(true);
    await deleteCustomer(customer.id);
    setIsLoading(false);
    callback();
    handleClose();
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteCustomer}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title={`Delete ${customer.name} customer`}
      text={
        <>
          <strong>Please note:</strong> Deleting the customer will also remove all associated
          payments, which may affect your monthly financial data. If you’re not working with the
          customer temporarily, it’s recommended to pause it instead. Deletion is permanent and will
          result in the complete loss of all information related to this customer.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to delete the customer ${customer.name}`}
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

export default DeleteCustomer;
