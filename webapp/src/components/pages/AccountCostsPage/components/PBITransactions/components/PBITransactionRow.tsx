import Link from 'next/link';

import { TableCell } from '@/components/molecules/DataTable/DataTable';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols, StatusColors } from '@/constants';
import { IPBITransaction, Currency, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  transaction: IPBITransaction;
  accountId: number;
  isLast: boolean;
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const PBITransactionRow = ({
  transaction,
  accountId,
  isLast,
  selectedCurrency,
  onTagClick,
}: IProps) => {
  const {
    amount,
    currency,
    rateUahToEur,
    rateUahToUsd,
    datePaid,
    dateShouldBePaid,
    pbiName,
    pbiId,
    status,
    pbiTags,
  } = transaction;

  return (
    <div
      className={`grid grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-7 ${
        isLast ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <Link
        href={`/account/${accountId}/costs/installments/${pbiId}`}
        className="col-span-3 contents sm:col-span-6"
      >
        <TableCell>
          <div className="flex">
            <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: StatusColors[status] }}
              />
            </div>
            <p className="font-medium">
              {pbiName} ({amount}
              {currencySymbols[currency]})
            </p>
          </div>
        </TableCell>
        <TableCell>
          {convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          })}
        </TableCell>
        <TableCell>{rateUahToUsd}</TableCell>
        <TableCell>{rateUahToEur}</TableCell>
        <TableCell>{formatDate(dateShouldBePaid)}</TableCell>
        <TableCell>{formatDate(datePaid)}</TableCell>
      </Link>

      <TableCell>
        {pbiTags.map((tag) => (
          <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
        ))}
      </TableCell>
    </div>
  );
};

export default PBITransactionRow;
