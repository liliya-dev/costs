'use client';
import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import { IAccount } from '@/types';
import { getAccount } from '@/utils/api';

import AccountInfo from './components/AccountInfo';
import EditAccount from './components/EditAccount/EditAccount';

interface IProps {
  accountId: number;
}
const AccountDetailsPage = ({ accountId }: IProps) => {
  const [account, setAccount] = useState<IAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenEditCustomer = () => setIsEditing(true);
  const handleCloseEditCustomer = () => setIsEditing(false);

  const getData = async () => {
    const res = await getAccount(accountId);
    if (res.data) {
      setAccount(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6">
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      {isEditing && account && (
        <EditAccount account={account} callback={getData} handleClose={handleCloseEditCustomer} />
      )}
      {!isLoading && account && (
        <AccountInfo account={account} handleOpenEditCustomer={handleOpenEditCustomer} />
      )}
    </div>
  );
};

export default AccountDetailsPage;
