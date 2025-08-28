import cx from 'classnames';
import { useEffect, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import { IIRPDates, IRC, DateStatus } from '@/types';
import { getDatesForTheRC } from '@/utils/api';
import { formatDate } from '@/utils/helpers/format-date.helper';
import { getDateRange } from '@/utils/helpers/get-dates-period.helper';

interface RCDatesPreviewProps {
  onDateChange: (selectedDate: string | null) => void;
  rc: IRC;
  initialSelectedDate?: string | null;
}

const RCDatesPreview = ({ rc, onDateChange, initialSelectedDate = null }: RCDatesPreviewProps) => {
  const [dates, setDates] = useState<IIRPDates[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialSelectedDate);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [disablePrevious, setDisablePrevious] = useState(false);

  const fetchDates = async (currentSkip: number) => {
    setIsLoading(true);
    const { startDate, endDate } = getDateRange(currentSkip);
    const res = await getDatesForTheRC(rc.id, startDate, endDate);
    const fetchedDates = res?.data || [];
    setDates(fetchedDates);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDates(skip);
  }, [skip]);

  useEffect(() => {
    if (!rc) return;

    if (skip !== 0) {
      setSkip(0);
    } else {
      fetchDates(0);
    }
    setSelectedDate(initialSelectedDate || null);
  }, [rc?.id]);

  useEffect(() => {
    if (!dates.length || !rc?.createdAt) {
      setDisablePrevious(false);
      return;
    }

    const minVisibleDate = dates.reduce<Date | null>((min, d) => {
      const current = new Date(d.date);
      if (!min || current < min) return current;
      return min;
    }, null);

    const customerCreatedDate = new Date(rc.createdAt);

    setDisablePrevious(minVisibleDate !== null && minVisibleDate <= customerCreatedDate);
  }, [dates, rc]);

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setErrorMsg('');
  }, [selectedDate, rc]);

  const toggleSelect = (dateItem: IIRPDates) => {
    if (dateItem.status !== DateStatus.NOT_PAID && dateItem.date !== initialSelectedDate) return;

    setSelectedDate((prev) => (prev === dateItem.date ? null : dateItem.date));
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex justify-between">
        <button
          type="button"
          className={cx(
            'text-sm text-blue-600 hover:underline',
            disablePrevious && 'cursor-not-allowed opacity-50',
          )}
          onClick={() => !disablePrevious && setSkip((prev) => prev - 1)}
          disabled={disablePrevious}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setSkip((prev) => prev + 1)}
        >
          Next →
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 w-full">
          <Loader />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {dates.map((item) => {
            const isSelected = selectedDate === item.date;
            const disabled = item.status === DateStatus.PAID && item.date !== initialSelectedDate;

            return (
              <div
                key={item.date}
                onClick={() => !disabled && toggleSelect(item)}
                className={cx('cursor-pointer select-none rounded-[5px] p-2 transition-colors', {
                  'cursor-not-allowed bg-gray-300 opacity-60':
                    item.status === DateStatus.PAID && item.date !== initialSelectedDate,
                  'border border-gray-300 bg-white hover:bg-gray-100':
                    (item.status === DateStatus.NOT_PAID || item.date === initialSelectedDate) &&
                    !isSelected &&
                    !disabled,
                  'bg-green-500 text-white': isSelected,
                })}
              >
                <p className="text-xs">{formatDate(item.date)}</p>
              </div>
            );
          })}
        </div>
      )}

      {errorMsg && <p className="mt-2 text-sm font-semibold text-red-500">{errorMsg}</p>}
    </div>
  );
};

export default RCDatesPreview;
