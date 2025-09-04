'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import {
  Currency,
  IAccount,
  IIRP,
  IOTI,
  IOTP,
  IPBITransaction,
  ISubscriptionTransaction,
  RCTransaction,
} from '@/types';
import {
  getAccount,
  getIrps,
  getOtis,
  getSubscriptionsTransactions,
  getRCTransactions,
  getPBITransactions,
  getOTPTransactions,
} from '@/utils/api';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { getBillingPeriod } from '@/utils/helpers/get-billing-period.helper';

import BillingPeriod from '../AccountIncomesPage/components/BillingPeriod/BillingPeriod';
import CurrencySwitcher from '../AccountIncomesPage/components/CurrencySwitcher/CurrencySwitcher';

import ExpensesStats from './components/ExpensesStats';
import IncomesStats from './components/IncomesStats';

interface IProps {
  id: number;
}

const AccountBalancePage = ({ id }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [skip, setSkip] = useState(+(searchParams.get('skip') ?? 0));
  const initialPeriod = getBillingPeriod(new Date(), skip);
  const [start, setStart] = useState(initialPeriod.startDate);
  const [end, setEnd] = useState(initialPeriod.endDate);
  const [account, setAccount] = useState<IAccount>();
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [irps, setIrps] = useState<IIRP[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.EUR);
  const [otis, setOtis] = useState<IOTI[]>([]);

  const [subscriptions, setSubscriptions] = useState<ISubscriptionTransaction[]>([]);
  const [rcTransactions, setRCTransactions] = useState<RCTransaction[]>([]);
  const [pbiTransactions, setPBITransactions] = useState<IPBITransaction[]>([]);
  const [otpTransactions, setOTPTransactions] = useState<IOTP[]>([]);

  const getData = async () => {
    const res = await getAccount(id);
    if (res.data) {
      setAccount(res.data);
    }
    setIsInitialDataLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const getOtisData = async (start: string, end: string) => {
    setIsLoading(true);
    const res = await getOtis(id, start, end);
    if (res.data) {
      setOtis(res.data);
    }
    setIsLoading(false);
  };

  const getIrpsData = async (start: string, end: string) => {
    setIsLoading(true);
    const res = await getIrps(id, start, end);
    if (res.data) {
      setIrps(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const { startDate, endDate } = getBillingPeriod(new Date(), skip);
    setEnd(endDate);
    setStart(startDate);
    fetchAllTransactions();
    getIrpsData(startDate, endDate);
    getOtisData(startDate, endDate);
    router.push(pathname + '?' + createQueryString('skip', `${skip}`));
  }, [skip]);

  const changeSkip = useCallback((n: number) => {
    setSkip((prev) => prev + n);
  }, []);

  const handleCurrencyChange = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
  }, []);

  const fetchAllTransactions = async () => {
    setIsLoading(true);

    const [subs, rc, pbi, otp] = await Promise.all([
      getSubscriptionsTransactions(id, start, end),
      getRCTransactions(id, start, end),
      getPBITransactions(id, start, end),
      getOTPTransactions(id, start, end),
    ]);

    if (subs.data) setSubscriptions(subs.data);
    if (rc.data) setRCTransactions(rc.data);
    if (pbi.data) setPBITransactions(pbi.data);
    if (otp.data) setOTPTransactions(otp.data);

    setIsLoading(false);
  };

  return (
    <>
      {(isInitialDataLoading || isLoading) && <Loader />}
      {!isInitialDataLoading && account && (
        <div className="pb-12">
          <div className="flex justify-between">
            <BillingPeriod start={start} end={end} changeSkip={changeSkip} />
            <CurrencySwitcher
              handleCurrencyChange={handleCurrencyChange}
              selectedCurrency={selectedCurrency}
            />
          </div>
          <div className="my-8 flex justify-between">
            <TableTitle title="Incomes for the selected period" />
          </div>
          <IncomesStats
            irps={irps}
            selectedCurrency={selectedCurrency}
            totalOti={otis.reduce(
              (sum, { amount, rateUahToEur, rateUahToUsd, currency }) =>
                sum +
                convertAmountToCurrency({
                  amount,
                  selectedCurrency,
                  rateUahToEur,
                  rateUahToUsd,
                  currency,
                }),
              0,
            )}
          />
          <div className="my-8 flex justify-between">
            <TableTitle title="Expenses for the selected period" />
          </div>
          <ExpensesStats
            selectedCurrency={selectedCurrency}
            subscriptions={subscriptions}
            rcTransactions={rcTransactions}
            pbiTransactions={pbiTransactions}
            otpTransactions={otpTransactions}
          />
        </div>
      )}
    </>
  );
};

export default AccountBalancePage;
