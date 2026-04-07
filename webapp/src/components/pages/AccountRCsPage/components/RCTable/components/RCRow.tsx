import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import { TableCell } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IRC, ITag } from '@/types';

import RCListTags from './RCListTags';

interface IProps {
  rc: IRC;
  index: number;
  total: number;
  accountId: number;
  onPay: (rc: IRC) => void;
  onEdit: (rc: IRC) => void;
  onDelete: (rc: IRC) => void;
  onTagClick: (tag: ITag) => void;
}

const RCRow = ({ rc, index, total, accountId, onPay, onEdit, onDelete, onTagClick }: IProps) => {
  const { id, name, monthlyPayment, currency, approximatelyPaymentDay, tags, isPermanentAmount } =
    rc;

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-6 ${
        index === total - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <Link href={`/account/${accountId}/costs/regular/${id}`} className="contents">
        <TableCell>
          <p className="font-medium">{name}</p>
        </TableCell>
        <TableCell>
          {monthlyPayment} {currencySymbols[currency]}
        </TableCell>
        <TableCell>{approximatelyPaymentDay}</TableCell>
        <TableCell>{isPermanentAmount ? 'Yes' : 'No'}</TableCell>
      </Link>
      <TableCell>
        <RCListTags tags={tags} onTagClick={onTagClick} />
      </TableCell>
      <TableCell>
        <div className="flex w-full justify-end">
          <IconButton iconHeight={24} iconColor="DARK" icon="Pay" onClick={() => onPay(rc)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="LIGHT" icon="Edit" onClick={() => onEdit(rc)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="RED" icon="Trash" onClick={() => onDelete(rc)} />
        </div>
      </TableCell>
    </div>
  );
};

export default RCRow;
