import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import { currencySymbols } from '@/constants';
import { IPBI, ITag } from '@/types';

import PBITags from './PBITags';

interface IProps {
  pbi: IPBI;
  index: number;
  total: number;
  accountId: number;
  onEdit: (pbi: IPBI) => void;
  onDelete: (pbi: IPBI) => void;
  onPay: (pbi: IPBI) => void;
  onTagClick: (tag: ITag) => void;
}

const PBIRow = ({ pbi, index, total, accountId, onEdit, onDelete, onPay, onTagClick }: IProps) => {
  const {
    id,
    name,
    monthlyPayment,
    currency,
    approximatelyPaymentDay,
    tags,
    isFullyPaid,
    numberOfPayments,
    transactions,
    numberOfDownpayments,
  } = pbi;

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-6 ${
        index === total - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <Link href={`/account/${accountId}/costs/installments/${id}`} className="contents">
        <TableRow>
          <div className="flex">
            <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: isFullyPaid ? '#22c55e' : '#f59e0b',
                }}
              />
            </div>
            <p className="font-medium">{name}</p>
          </div>
        </TableRow>
        <TableRow>
          {monthlyPayment} {currencySymbols[currency]}
        </TableRow>
        <TableRow>
          {transactions.length + numberOfDownpayments} / {numberOfPayments}
        </TableRow>
        <TableRow>{approximatelyPaymentDay}</TableRow>
      </Link>
      <TableRow>
        <PBITags tags={tags} onTagClick={onTagClick} />
      </TableRow>
      <TableRow>
        <div className="flex w-full justify-end">
          {!isFullyPaid && (
            <>
              <IconButton iconHeight={24} iconColor="DARK" icon="Pay" onClick={() => onPay(pbi)} />
              <div className="ml-4" />
            </>
          )}
          <IconButton iconHeight={24} iconColor="LIGHT" icon="Edit" onClick={() => onEdit(pbi)} />
          <div className="ml-4" />
          <IconButton iconHeight={24} iconColor="RED" icon="Trash" onClick={() => onDelete(pbi)} />
        </div>
      </TableRow>
    </div>
  );
};

export default PBIRow;
