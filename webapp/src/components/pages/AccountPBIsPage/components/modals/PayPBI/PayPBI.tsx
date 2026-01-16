import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IPBI } from '@/types';
import { payPBIPayments } from '@/utils/api';

import PBIDatesPreview from '../../PBIDatesPreview/PBIDatesPreview';

interface IProps {
  pbi: IPBI;
  handleClose: () => void;
  callback: () => void;
}

const PayPBI = ({ pbi, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const handlePayPBI = useCallback(async () => {
    setIsLoading(true);
    await payPBIPayments({
      pbiId: pbi.id,
      datesShouldBePaid: dates,
    });
    setIsLoading(false);
    callback();
    handleClose();
  }, [dates]);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handlePayPBI}
      primaryButtonText="Pay"
      secondaryButtonText="Cancel"
      title={`Creating payments for ${pbi.name}`}
      text={'Here you can create few payments or pay off and finish this payment by installments'}
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
      <PBIDatesPreview
        pbi={pbi}
        onDatesChange={(selectedDates: string[]) => setDates(selectedDates)}
      />
    </FullScreenModal>
  );
};

export default PayPBI;
