import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols } from '@/constants';
import { IRC } from '@/types';

interface IProps {
  accountId: number;
  rcs: IRC[];
  handleOpenEditRC: (rc: IRC) => void;
  handleOpenDeleteRC: (rc: IRC) => void;
  handleOpenPayRC: (rc: IRC) => void;
}

const RCList = ({
  rcs,
  handleOpenDeleteRC,
  handleOpenEditRC,
  handleOpenPayRC,
  accountId,
}: IProps) => {
  return (
    <>
      {rcs.map(
        (
          { monthlyPayment, currency, approximatelyPaymentDay, tags, name, isPermanentAmount, id },
          index,
        ) => (
          <div
            key={id}
            className={`grid grid-cols-3 sm:grid-cols-6 ${
              index === rcs.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
            }`}
          >
            <Link href={`/account/${accountId}/costs/regular/${id}`} className="contents">
              <TableRow>
                <p className="font-medium">{name}</p>
              </TableRow>
              <TableRow>
                {monthlyPayment} {currencySymbols[currency]}
              </TableRow>
              <TableRow>{approximatelyPaymentDay}</TableRow>
              <TableRow>{isPermanentAmount ? 'Yes' : 'No'}</TableRow>
            </Link>
            <TableRow>
              {tags.map((item) => (
                <Tag key={item.id} label={item.name} color={item.color} />
              ))}
            </TableRow>
            <TableRow>
              <div className="flex w-full justify-end">
                <IconButton
                  iconHeight={24}
                  iconColor="DARK"
                  icon="Pay"
                  onClick={() => handleOpenPayRC(rcs[index])}
                />
                <div className="ml-4" />
                <IconButton
                  iconHeight={24}
                  iconColor="LIGHT"
                  icon="Edit"
                  onClick={() => handleOpenEditRC(rcs[index])}
                />
                <div className="ml-4" />
                <IconButton
                  iconHeight={24}
                  iconColor="RED"
                  icon="Trash"
                  onClick={() => handleOpenDeleteRC(rcs[index])}
                />
              </div>
            </TableRow>
          </div>
        ),
      )}
      {!rcs.length && (
        <div className="bg-white px-6 py-12">
          <p className="text-center text-lg">There are no RCs yet</p>
        </div>
      )}
    </>
  );
};

export default RCList;
