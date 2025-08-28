import { useCallback, useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { currencySymbols } from '@/constants';
import { ITransaction } from '@/types';
import { deleteTransaction, getTransaction } from '@/utils/api';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  transactionId: number;
  handleClose: () => void;
  callback: () => void;
}

const headers = ['Name', 'Date paid', 'Date should be paid'];

const DeleteIRPTransaction = ({ transactionId, handleClose, callback }: IProps) => {
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleDeleteTransaction = useCallback(async () => {
    if (transaction) {
      setIsLoading(true);

      await deleteTransaction(transaction?.id);
      callback();
      handleClose();
    }
  }, []);

  return (
    <FullScreenModal
      isPrimaryButtonDisabled={!transaction}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleDeleteTransaction}
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
      title="Delete transaction"
      text="This transaction will be deleted with all payments bellow: "
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
        {transaction && (
          <div className="p-4">
            <div className="grid grid-cols-3">
              {headers.map((item) => (
                <TableHeader key={item} title={item} />
              ))}
            </div>
            {transaction.irps.map(({ amount, currency, id, dateShouldBePaid, datePaid }, index) => (
              <div
                key={id}
                className={`grid grid-cols-3 ${
                  index === transaction.irps.length - 1
                    ? ''
                    : 'border-b border-stroke dark:border-dark-3'
                }`}
              >
                <TableRow>
                  <p className="font-medium">
                    {transaction.customer.name} ({amount}
                    {currencySymbols[currency]})
                  </p>
                </TableRow>
                <TableRow>{formatDate(dateShouldBePaid)}</TableRow>
                <TableRow>{formatDate(datePaid)}</TableRow>
              </div>
            ))}
          </div>
        )}
      </>
    </FullScreenModal>
  );
};

export default DeleteIRPTransaction;
