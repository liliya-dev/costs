import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols } from '@/constants';
import { IPBI } from '@/types';

interface IProps {
  accountId: number;
  pbis: IPBI[];
  handleOpenEditPBI: (pbi: IPBI) => void;
  handleOpenDeletePBI: (pbi: IPBI) => void;
  handleOpenPayedPBI: (pbi: IPBI) => void;
}

const PBIList = ({
  pbis,
  handleOpenDeletePBI,
  handleOpenEditPBI,
  handleOpenPayedPBI,
  accountId,
}: IProps) => {
  return (
    <>
      {pbis.map(
        (
          {
            monthlyPayment,
            currency,
            approximatelyPaymentDay,
            tags,
            name,
            isFullyPaid,
            numberOfPayments,
            transactions,
            id,
          },
          index,
        ) => (
          <div
            key={id}
            className={`grid grid-cols-3 sm:grid-cols-6 ${
              index === pbis.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
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
                {transactions.length} / {numberOfPayments}
              </TableRow>
              <TableRow>{approximatelyPaymentDay}</TableRow>
            </Link>
            <TableRow>
              {tags.map((item) => (
                <Tag key={item.id} label={item.name} color={item.color} />
              ))}
            </TableRow>
            <TableRow>
              <div className="flex w-full justify-end">
                {!isFullyPaid && (
                  <>
                    <IconButton
                      iconHeight={24}
                      iconColor="DARK"
                      icon="Pay"
                      onClick={() => handleOpenPayedPBI(pbis[index])}
                    />
                    <div className="ml-4" />
                  </>
                )}
                <IconButton
                  iconHeight={24}
                  iconColor="LIGHT"
                  icon="Edit"
                  onClick={() => handleOpenEditPBI(pbis[index])}
                />
                <div className="ml-4" />
                <IconButton
                  iconHeight={24}
                  iconColor="RED"
                  icon="Trash"
                  onClick={() => handleOpenDeletePBI(pbis[index])}
                />
              </div>
            </TableRow>
          </div>
        ),
      )}
      {!pbis.length && (
        <div className="bg-white px-6 py-12">
          <p className="text-center text-lg">There are no PBIs yet</p>
        </div>
      )}
    </>
  );
};

export default PBIList;
