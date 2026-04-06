import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import DatesGrid from '@/components/pages/AccountIncomesPage/components/AddCustomerPayment/components/IRPDatesPreview/components/DatesGrid';
import { DateStatus, IIRPDates, IPBI } from '@/types';
import { getDatesForThePBI } from '@/utils/api';

interface PBIDatesPreviewProps {
  pbi: IPBI;
  initialSelectedDates?: string[];
  onDatesChange: (selectedDates: string[]) => void;
}

const PBIDatesPreview = ({
  pbi,
  initialSelectedDates = [],
  onDatesChange,
}: PBIDatesPreviewProps) => {
  const [dates, setDates] = useState<IIRPDates[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>(initialSelectedDates);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDates = async () => {
    setIsLoading(true);
    const res = await getDatesForThePBI(pbi.id);
    const fetchedDates = res?.data || [];
    setDates(fetchedDates);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    onDatesChange(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    setErrorMsg('');
  }, [selectedDates, pbi]);

  const toggleSelect = ({ date, status }: IIRPDates) => {
    const isInitial = initialSelectedDates.includes(date);
    const isSelected = selectedDates.includes(date);
    const maxReached =
      selectedDates.length ===
      pbi.numberOfPayments - pbi.numberOfDownpayments - pbi.transactions.length;

    if (status !== DateStatus.NOT_PAID && !isInitial) return;
    if (!isSelected && maxReached)
      return setErrorMsg(
        `You must selec no more than exactly ${pbi.numberOfPayments - pbi.numberOfDownpayments - pbi.transactions.length} dates`,
      );

    setErrorMsg('');
    setSelectedDates((prev) => (isSelected ? prev.filter((d) => d !== date) : [...prev, date]));
  };

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="h-40 w-full">
          <Loader />
        </div>
      ) : (
        <DatesGrid
          dates={dates}
          selectedDates={selectedDates}
          numberOfPayments={
            pbi.numberOfPayments - pbi.numberOfDownpayments - pbi.transactions.length
          }
          initialSelectedDates={initialSelectedDates}
          onToggleSelect={toggleSelect}
        />
      )}
      {errorMsg && <p className="mt-2 text-sm font-semibold text-red-500">{errorMsg}</p>}
    </div>
  );
};

export default PBIDatesPreview;
