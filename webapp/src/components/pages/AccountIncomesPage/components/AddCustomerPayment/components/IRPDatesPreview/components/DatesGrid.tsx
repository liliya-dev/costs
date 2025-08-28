import cx from 'classnames';

import { DateStatus, IIRPDates } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  dates: IIRPDates[];
  selectedDates: string[];
  numberOfPayments: number;
  initialSelectedDates: string[];
  onToggleSelect: (date: IIRPDates) => void;
}

const DatesGrid = ({
  dates,
  selectedDates,
  numberOfPayments,
  initialSelectedDates,
  onToggleSelect,
}: IProps) => {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {dates.map((item) => {
        const isSelected = selectedDates.includes(item.date);
        const maxSelectedReached = selectedDates.length === numberOfPayments;
        const disabled =
          (item.status === DateStatus.PAID && !initialSelectedDates.includes(item.date)) ||
          (maxSelectedReached && !isSelected);

        return (
          <div
            key={item.date}
            onClick={() => !disabled && onToggleSelect(item)}
            className={cx('cursor-pointer select-none rounded-[5px] p-2 transition-colors', {
              'cursor-not-allowed bg-gray-300 opacity-60':
                item.status === DateStatus.PAID && !initialSelectedDates.includes(item.date),
              'border border-gray-300 bg-white hover:bg-gray-100':
                (item.status === DateStatus.NOT_PAID || initialSelectedDates.includes(item.date)) &&
                !isSelected &&
                !disabled,
              'cursor-not-allowed border border-gray-300 bg-white opacity-50':
                disabled && !isSelected,
              'bg-green-500 text-white': isSelected,
            })}
          >
            <p className="text-xs">{formatDate(item.date)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DatesGrid;
