import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { currencySymbols } from '@/constants';
import { IOTI } from '@/types';
import { deleteOti } from '@/utils/api';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  oti: IOTI;
  handleClose: () => void;
  callback: () => void;
}

const headers = ['Name', 'Amount', 'Date paid', 'Description'];

const DeleteOTITransaction = ({ oti, handleClose, callback }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteOti = useCallback(async () => {
    setIsLoading(true);

    await deleteOti(oti?.id);
    callback();
    handleClose();
    setIsLoading(false);
  }, []);
  return (
    <FullScreenModal
      isPrimaryButtonDisabled={false}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteOti}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title="Delete one time payment"
      text="This one time payment transaction will be deleted."
      primaryButtonType="submit"
      confirmBeforePrimaryAction={true}
      confirmTitle="Are you sure you want to delete it?"
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
      <div className="p-4">
        <div className="grid grid-cols-4">
          {headers.map((item) => (
            <TableHeader key={item} title={item} />
          ))}
        </div>
        <div className={`grid grid-cols-4 border-t border-stroke dark:border-dark-3`}>
          <TableRow>
            <p className="font-medium">{oti.name}</p>
          </TableRow>
          <TableRow>
            {oti.amount}
            {currencySymbols[oti.currency]}
          </TableRow>
          <TableRow>{formatDate(oti.datePaid)}</TableRow>
          <TableRow>{oti.description}</TableRow>
        </div>
      </div>
    </FullScreenModal>
  );
};

export default DeleteOTITransaction;
