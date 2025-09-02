import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { currencySymbols } from '@/constants';
import { IPBI } from '@/types';
import { payPBI } from '@/utils/api';

interface IProps {
  pbi: IPBI;
  handleClose: () => void;
  callback: () => void;
}

const PayPBI = ({ pbi, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteSubscription = useCallback(async () => {
    setIsLoading(true);
    await payPBI(pbi.id);
    setIsLoading(false);
    callback();
    handleClose();
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteSubscription}
      primaryButtonText="Pay off"
      secondaryButtonText="Cancel"
      title={`Do you really want to pay off the installment plan for ${pbi.name} completely?`}
      text={
        <>
          By clicking the button, you will be charged{' '}
          <strong>
            {pbi.numberOfPayments - pbi.transactions.length - pbi.numberOfDownpayments}
          </strong>{' '}
          payments of{' '}
          <strong>
            {pbi.monthlyPayment} {currencySymbols[pbi.currency]}
          </strong>
          , and the installment plan will be fully paid off. These payments will be recorded in the
          current billing period.
        </>
      }
      confirmBeforePrimaryAction={true}
      confirmTitle={`Are you sure you want to pay off payment by installments for ${pbi.name}`}
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

export default PayPBI;
