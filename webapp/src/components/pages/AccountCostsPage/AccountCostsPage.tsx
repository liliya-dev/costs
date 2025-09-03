'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import {
  IOTP,
  IPBITransaction,
  ISubscriptionTransaction,
  RCTransaction,
  ITag,
  Currency,
} from '@/types';
import {
  getSubscriptionsTransactions,
  getRCTransactions,
  getPBITransactions,
  getOTPTransactions,
} from '@/utils/api';
import { getBillingPeriod } from '@/utils/helpers/get-billing-period.helper';

import BillingPeriod from '../AccountIncomesPage/components/BillingPeriod/BillingPeriod';
import CurrencySwitcher from '../AccountIncomesPage/components/CurrencySwitcher/CurrencySwitcher';

import ExpensesStats from './components/ExpensesStats/ExpensesStats';
import OTPTransactions from './components/OTPTransactions/OTPTransactions';
import PBITransactions from './components/PBITransactions/PBITransactions';
import RCTransactions from './components/RCTransactions/RCTransactions';
import SelectedTags from './components/SelectedTags/SelectedTags';
import SubscriptionsTransactions from './components/SubscriptionsTransactions/SubscriptionsTransactions';

interface IProps {
  id: number;
}

const AccountCostsPage = ({ id }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [skip, setSkip] = useState(+(searchParams.get('skip') ?? 0));
  const initialPeriod = getBillingPeriod(new Date(), skip);
  const [start, setStart] = useState(initialPeriod.startDate);
  const [end, setEnd] = useState(initialPeriod.endDate);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.EUR);
  const [isLoading, setIsLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState<ISubscriptionTransaction[]>([]);
  const [rcTransactions, setRCTransactions] = useState<RCTransaction[]>([]);
  const [pbiTransactions, setPBITransactions] = useState<IPBITransaction[]>([]);
  const [otpTransactions, setOTPTransactions] = useState<IOTP[]>([]);

  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  // Generic helper to filter any list by selected tags
  function filterByTags<T>(items: T[], getTags: (item: T) => ITag[], tagsToFilter: ITag[]): T[] {
    if (!tagsToFilter.length) return items;
    return items.filter((item) =>
      tagsToFilter.every((tag) => getTags(item).some((t) => t.id === tag.id)),
    );
  }

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const { startDate, endDate } = getBillingPeriod(new Date(), skip);
    setEnd(endDate);
    setStart(startDate);
    router.push(pathname + '?' + createQueryString('skip', `${skip}`));
  }, [skip]);

  useEffect(() => {
    fetchAllTransactions();
  }, [start, end]);

  const changeSkip = (n: number) => setSkip(skip + n);

  const handleCurrencyChange = (currency: Currency) => setSelectedCurrency(currency);

  const handleUpdateSelectedTags = (tag: ITag) => {
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.id === tag.id);
      if (exists) return prev;
      return [...prev, tag];
    });
  };

  const removeSelectedTag = (tag: ITag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="pb-12">
          <div className="flex justify-between">
            <BillingPeriod start={start} end={end} changeSkip={changeSkip} />
            <CurrencySwitcher
              handleCurrencyChange={handleCurrencyChange}
              selectedCurrency={selectedCurrency}
            />
          </div>
          <div className="my-6" />
          <ExpensesStats
            selectedCurrency={selectedCurrency}
            subscriptions={filterByTags(subscriptions, (sub) => sub.subscriptionTags, selectedTags)}
            rcTransactions={filterByTags(rcTransactions, (rc) => rc.rcTags, selectedTags)}
            pbiTransactions={filterByTags(pbiTransactions, (pbi) => pbi.pbiTags, selectedTags)}
            otpTransactions={filterByTags(otpTransactions, (otp) => otp.tags, selectedTags)}
          />

          <SelectedTags selectedTags={selectedTags} removeSelectedTag={removeSelectedTag} />
          <SubscriptionsTransactions
            subscriptions={filterByTags(subscriptions, (sub) => sub.subscriptionTags, selectedTags)}
            accountId={id}
            selectedCurrency={selectedCurrency}
            onTagClick={handleUpdateSelectedTags}
          />
          <RCTransactions
            transactions={filterByTags(rcTransactions, (rc) => rc.rcTags, selectedTags)}
            accountId={id}
            selectedCurrency={selectedCurrency}
            onTagClick={handleUpdateSelectedTags}
          />
          <PBITransactions
            transactions={filterByTags(pbiTransactions, (pbi) => pbi.pbiTags, selectedTags)}
            accountId={id}
            selectedCurrency={selectedCurrency}
            onTagClick={handleUpdateSelectedTags}
          />
          <OTPTransactions
            transactions={filterByTags(otpTransactions, (otp) => otp.tags, selectedTags)}
            accountId={id}
            selectedCurrency={selectedCurrency}
            onTagClick={handleUpdateSelectedTags}
          />
        </div>
      )}
    </>
  );
};

export default AccountCostsPage;
