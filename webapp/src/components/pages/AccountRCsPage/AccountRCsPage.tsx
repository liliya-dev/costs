'use client';

import { useState, useCallback, useEffect } from 'react';

import { IRC } from '@/types';
import { getRCsByAccountId } from '@/utils/api';

import AddRC from './components/AddRC/AddRC';
import RCTable from './components/RCTable/RCTable';

interface IProps {
  accountId: number;
}

const AccountRCsPage = ({ accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rcList, setRCList] = useState<IRC[]>([]);

  const fetchRC = useCallback(async () => {
    setIsLoading(true);
    const res = await getRCsByAccountId(accountId);
    if (res.data) {
      setRCList(res.data);
    }
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchRC();
  }, [fetchRC]);

  return (
    <div>
      <AddRC accountId={accountId} callback={fetchRC} />
      <RCTable isLoading={isLoading} rcs={rcList} callback={fetchRC} accountId={accountId} />
    </div>
  );
};

export default AccountRCsPage;
