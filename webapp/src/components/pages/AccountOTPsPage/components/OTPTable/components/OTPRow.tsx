import IconButton from '@/components/atoms/IconButton/IconButton';
import { TableCell } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IOTP, ITag } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

import OTPTags from './OTPTags';

interface IProps {
  otp: IOTP;
  index: number;
  total: number;
  onEdit: (otp: IOTP) => void;
  onDelete: (otp: IOTP) => void;
  onTagClick?: (tag: ITag) => void;
}

const OTPRow = ({ otp, index, total, onEdit, onDelete, onTagClick }: IProps) => {
  const { name, amount, currency, datePaid, description, tags } = otp;

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-6 ${
        index === total - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <TableCell>
        <p className="font-medium">{name}</p>
      </TableCell>
      <TableCell>
        {amount} {currencySymbols[currency]}
      </TableCell>
      <TableCell>{formatDate(datePaid)}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        <OTPTags tags={tags} onTagClick={onTagClick} />
      </TableCell>
      <TableCell>
        <div className="flex w-full justify-end">
          <IconButton iconHeight={24} iconColor="LIGHT" icon="Edit" onClick={() => onEdit(otp)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="RED" icon="Trash" onClick={() => onDelete(otp)} />
        </div>
      </TableCell>
    </div>
  );
};

export default OTPRow;
