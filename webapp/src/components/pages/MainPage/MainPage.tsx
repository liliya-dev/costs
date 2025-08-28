'use client';
import { useEffect, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Loader from '@/components/atoms/Loader/Loader';
import Text from '@/components/atoms/Text/Text';
import { IAccount } from '@/types';
import { getAccounts } from '@/utils/api';

import AccountItem from './components/AccountItem/AccountItem';
import AddAccount from './components/AddAccount/AddAccount';

const MainPage = () => {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const getData = async () => {
    const res = await getAccounts();
    if (res.data) {
      setAccounts(res.data);
    }
    setIsLoading(false);
  };

  const handleToggleAddForm = () => setIsAddFormVisible(!isAddFormVisible);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Text text="Available accounts:" color="DARK" size="XXL" />
      <div className="my-8" />
      {isAddFormVisible && (
        <AddAccount callback={getData} handleToggleAddForm={handleToggleAddForm} />
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {accounts.map((account) => (
            <AccountItem callback={getData} key={account.id} account={account} />
          ))}
          <div className="my-8" />
          <Button
            onClick={handleToggleAddForm}
            title="+&nbsp;&nbsp;&nbsp;Add new account"
            type="DARK"
          />
        </>
      )}
    </div>
  );
};

export default MainPage;
