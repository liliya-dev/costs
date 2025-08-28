'use client';

import { useState, useCallback, useEffect } from 'react';

import { IOTP } from '@/types';
import { getOTPsByAccountId } from '@/utils/api';

import AddOTP from './components/AddOTP/AddOTP';
import OTPTable from './components/OTPTable/OTPTable';

interface IProps {
  accountId: number;
}

const AccountOTPsPage = ({ accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [otps, setOtps] = useState<IOTP[]>([]);

  const fetchOTPs = useCallback(async () => {
    setIsLoading(true);
    const res = await getOTPsByAccountId(accountId);
    if (res.data) {
      setOtps(res.data);
    }
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchOTPs();
  }, [fetchOTPs]);

  return (
    <div>
      <AddOTP accountId={accountId} callback={fetchOTPs} />
      <OTPTable isLoading={isLoading} otps={otps} callback={fetchOTPs} accountId={accountId} />
    </div>
  );
};

export default AccountOTPsPage;
