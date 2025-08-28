import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import { DateStatus, ICustomer, IIRPDates } from '@/types';
import { getDatesForTheIrp } from '@/utils/api';
import { getDateRange } from '@/utils/helpers/get-dates-period.helper';
import { getMinDateFromDates } from '@/utils/helpers/get-min-date.helper';

import DatesGrid from './components/DatesGrid';
import NavigationControls from './components/NavigationControls';

interface IRPDatesPreviewProps {
  numberOfPayments: number;
  onDatesChange: (selectedDates: string[]) => void;
  customer: ICustomer;
  initialSelectedDates?: string[];
}

const IRPDatesPreview = ({
  customer,
  numberOfPayments,
  onDatesChange,
  initialSelectedDates = [],
}: IRPDatesPreviewProps) => {
  const [dates, setDates] = useState<IIRPDates[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>(initialSelectedDates);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [disablePrevious, setDisablePrevious] = useState(false);

  const fetchDates = async (currentSkip: number) => {
    setIsLoading(true);
    const { startDate, endDate } = getDateRange(currentSkip);
    const res = await getDatesForTheIrp(customer.id, startDate, endDate);
    const fetchedDates = res?.data || [];
    setDates(fetchedDates);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDates(skip);
  }, [skip]);

  useEffect(() => {
    if (!customer) return;
    if (skip !== 0) {
      setSkip(0);
    } else {
      fetchDates(0);
    }
    setSelectedDates(initialSelectedDates);
  }, [customer?.id]);

  useEffect(() => {
    if (!dates.length || !customer?.createdAt) {
      setDisablePrevious(false);
      return;
    }
    const minVisibleDate = getMinDateFromDates(dates);
    const customerCreatedDate = new Date(customer.createdAt);
    setDisablePrevious(minVisibleDate !== null && minVisibleDate <= customerCreatedDate);
  }, [dates, customer]);

  useEffect(() => {
    onDatesChange(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    setErrorMsg('');
  }, [selectedDates, numberOfPayments, customer]);

  useEffect(() => {
    if (selectedDates.length > numberOfPayments) {
      setSelectedDates((prev) => prev.slice(prev.length - numberOfPayments));
      setErrorMsg('');
    }
  }, [numberOfPayments]);

  const toggleSelect = ({ date, status }: IIRPDates) => {
    const isInitial = initialSelectedDates.includes(date);
    const isSelected = selectedDates.includes(date);
    const maxReached = selectedDates.length === numberOfPayments;

    if (status !== DateStatus.NOT_PAID && !isInitial) return;
    if (!isSelected && maxReached)
      return setErrorMsg(`You must select exactly ${numberOfPayments} dates`);

    setErrorMsg('');
    setSelectedDates((prev) => (isSelected ? prev.filter((d) => d !== date) : [...prev, date]));
  };

  return (
    <div className="mt-6">
      <NavigationControls
        disablePrevious={disablePrevious}
        onPrevious={() => !disablePrevious && setSkip((prev) => prev - 1)}
        onNext={() => setSkip((prev) => prev + 1)}
      />
      {isLoading ? (
        <div className="h-40 w-full">
          <Loader />
        </div>
      ) : (
        <DatesGrid
          dates={dates}
          selectedDates={selectedDates}
          numberOfPayments={numberOfPayments}
          initialSelectedDates={initialSelectedDates}
          onToggleSelect={toggleSelect}
        />
      )}

      {errorMsg && <p className="mt-2 text-sm font-semibold text-red-500">{errorMsg}</p>}
    </div>
  );
};

export default IRPDatesPreview;
