'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IRCWithTransactions } from '@/types';
import { getRCsById } from '@/utils/api';

import TransactionsTable from './components/TransactionsTable/TransactionsTable';

interface IProps {
  accountId: number;
  rcId: number;
}

const RCPage = ({ rcId }: IProps) => {
  const [rc, setRC] = useState<IRCWithTransactions>();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    const res = await getRCsById(rcId);
    if (res.data) {
      setRC(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && rc && (
        <>
          <TableTitle title={`${rc.name.replace(/^\s*\w/, (c) => c.toUpperCase())} payments`} />
          <TransactionsTable transactions={rc.transactions} />
        </>
      )}
    </div>
  );
};

export default RCPage;
