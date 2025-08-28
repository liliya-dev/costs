import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IOTP } from '@/types';

import DeleteOTP from '../modals/DeleteOTP/DeleteOTP';
import EditOTP from '../modals/EditOTP/EditOTP';

import OTPList from './components/OTPList/OTPList';

interface IProps {
  otps: IOTP[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = ['Name', 'Amount', 'Date Paid', 'Description', 'Tags', ''];

const OTPTable = ({ otps, isLoading, callback, accountId }: IProps) => {
  const [editedOTP, setEditedOTP] = useState<IOTP | null>(null);
  const [deletedOTP, setDeletedOTP] = useState<IOTP | null>(null);

  const handleOpenEditOTP = useCallback((otp: IOTP) => {
    setEditedOTP(otp);
  }, []);

  const handleCloseEditOTP = useCallback(() => {
    setEditedOTP(null);
  }, []);

  const handleOpenDeleteOTP = useCallback((otp: IOTP) => {
    setDeletedOTP(otp);
  }, []);

  const handleCloseDeleteOTP = useCallback(() => {
    setDeletedOTP(null);
  }, []);

  return (
    <>
      {deletedOTP && (
        <DeleteOTP callback={callback} otp={deletedOTP} handleClose={handleCloseDeleteOTP} />
      )}
      {editedOTP && (
        <EditOTP
          accountId={accountId}
          otp={editedOTP}
          callback={callback}
          handleClose={handleCloseEditOTP}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="All one time payments" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {headers.map((item) => (
              <TableHeader key={item} title={item} />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <OTPList
              otps={otps}
              handleOpenDeleteOTP={handleOpenDeleteOTP}
              handleOpenEditOTP={handleOpenEditOTP}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OTPTable;
