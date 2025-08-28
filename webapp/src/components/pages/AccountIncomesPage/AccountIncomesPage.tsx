'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import CustomersTable from '@/components/pages/AccountIncomesPage/components/CustomersTable/CustomersTable';
import { Currency, IAccount, IIRP, IOTI } from '@/types';
import { getAccount, getIrps, getOtis } from '@/utils/api';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { getBillingPeriod } from '@/utils/helpers/get-billing-period.helper';

import AddCustomerPayment from './components/AddCustomerPayment/AddCustomerPayment';
import AddOneTimePayment from './components/AddOneTimePayment/AddOneTimePayment';
import BillingPeriod from './components/BillingPeriod/BillingPeriod';
import CurrencySwitcher from './components/CurrencySwitcher/CurrencySwitcher';
import DataStats from './components/DataStats/DataStatsOne';
import OtiTable from './components/OtiTable/OtiTable';
import StatsChart from './components/StatsChart/StatsChart';
import Tabs from './components/Tabs/Tabs';

interface IProps {
  id: number;
}

const AccountIncomesPage = ({ id }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [skip, setSkip] = useState(+(searchParams.get('skip') ?? 0));
  const initialPeriod = getBillingPeriod(new Date(), skip);
  const [start, setStart] = useState(initialPeriod.startDate);
  const [end, setEnd] = useState(initialPeriod.endDate);
  const [account, setAccount] = useState<IAccount>();
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [isIrpLoading, setIsIrpLoading] = useState(true);
  const [irps, setIrps] = useState<IIRP[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.EUR);
  const [otis, setOtis] = useState<IOTI[]>([]);

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
    setIsIrpLoading(true);
    const res = await getOtis(id, start, end);
    if (res.data) {
      setOtis(res.data);
    }
    setIsIrpLoading(false);
  };

  const getIrpsData = async (start: string, end: string) => {
    setIsIrpLoading(true);
    const res = await getIrps(id, start, end);
    if (res.data) {
      setIrps(res.data);
    }
    setIsIrpLoading(false);
  };

  const reAskIrps = useCallback(() => {
    return getIrpsData(start, end);
  }, [start, end]);

  const reAskOtis = useCallback(() => {
    return getOtisData(start, end);
  }, [start, end]);

  useEffect(() => {
    const { startDate, endDate } = getBillingPeriod(new Date(), skip);
    setEnd(endDate);
    setStart(startDate);
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

  return (
    <>
      {isInitialDataLoading && <Loader />}
      {!isInitialDataLoading && account && (
        <div className="pb-12">
          <div className="flex justify-between">
            <BillingPeriod start={start} end={end} changeSkip={changeSkip} />
            <CurrencySwitcher
              handleCurrencyChange={handleCurrencyChange}
              selectedCurrency={selectedCurrency}
            />
          </div>
          <div className="my-6" />
          <DataStats
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
          <div className="my-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            <StatsChart irps={irps} selectedCurrency={selectedCurrency} />
            <Tabs
              items={[
                {
                  title: 'Customer payment',
                  id: '1',
                  component: (
                    <AddCustomerPayment callback={reAskIrps} customers={account.customers || []} />
                  ),
                },
                {
                  title: 'One time payment',
                  id: '2',
                  component: <AddOneTimePayment callback={reAskOtis} accountId={account.id} />,
                },
              ]}
            />
          </div>

          <div className="col-span-12 xl:col-span-8">
            <CustomersTable
              selectedCurrency={selectedCurrency}
              isLoading={isIrpLoading}
              irps={irps}
              customers={account.customers || []}
              handleDataReload={reAskIrps}
              accountId={id}
            />
          </div>
          <div className="col-span-12 xl:col-span-8">
            <OtiTable
              selectedCurrency={selectedCurrency}
              isLoading={isIrpLoading}
              otis={otis}
              handleDataReload={reAskOtis}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AccountIncomesPage;
