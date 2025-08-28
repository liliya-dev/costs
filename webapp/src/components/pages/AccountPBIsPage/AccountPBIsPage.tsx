'use client';

import { useState, useCallback, useEffect } from 'react';

import { IPBI } from '@/types';
import { getPBIsByAccountId } from '@/utils/api';

import AddPBI from './components/AddPBI/AddPBI';
import PBITable from './components/PBITable/PBITable';

interface IProps {
  accountId: number;
}
const AccountPBIsPage = ({ accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pbis, setPbis] = useState<IPBI[]>([]);

  const fetchPBIs = useCallback(async () => {
    setIsLoading(true);
    const res = await getPBIsByAccountId(accountId);
    if (res.data) {
      setPbis(res.data);
    }
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchPBIs();
  }, [fetchPBIs]);

  return (
    <div>
      <AddPBI accountId={accountId} callback={fetchPBIs} />
      <PBITable isLoading={isLoading} pbis={pbis} callback={fetchPBIs} accountId={accountId} />
    </div>
  );
};

export default AccountPBIsPage;
