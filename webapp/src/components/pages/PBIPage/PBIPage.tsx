'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IPBI } from '@/types';
import { getPBIById } from '@/utils/api';

import TransactionsTable from './components/TransactionsTable/TransactionsTable';

interface IProps {
  accountId: number;
  pbiId: number;
}

const PBIPage = ({ pbiId }: IProps) => {
  const [pbi, setPBI] = useState<IPBI>();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    const res = await getPBIById(pbiId);
    if (res.data) {
      setPBI(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && pbi && (
        <>
          <TableTitle title={`${pbi.name.replace(/^\s*\w/, (c) => c.toUpperCase())} payments`} />
          <TransactionsTable transactions={pbi.transactions} />
        </>
      )}
    </div>
  );
};

export default PBIPage;
