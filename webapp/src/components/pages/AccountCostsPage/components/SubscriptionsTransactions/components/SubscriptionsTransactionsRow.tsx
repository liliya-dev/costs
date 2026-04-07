import Link from 'next/link';

import { TableCell } from '@/components/molecules/DataTable/DataTable';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols, StatusColors } from '@/constants';
import { Currency, ISubscriptionTransaction, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  accountId: number;
  subscription: ISubscriptionTransaction;
  isLast: boolean;
  selectedCurrency: Currency;
  onTagClick: (tag: ITag) => void;
}

const SubscriptionsTransactionsRow = ({
  subscription,
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
    subscriptionName,
    subscriptionId,
    subscriptionTags,
  } = subscription;

  return (
    <div
      className={`grid grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-6 ${
        isLast ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
    >
      <Link
        href={`/account/${accountId}/costs/subscriptions/${subscriptionId}`}
        className="col-span-3 contents sm:col-span-5"
      >
        <TableCell>
          <div className="flex">
            <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: datePaid ? StatusColors.PAID_IN_PERIOD : StatusColors.NOT_PAID,
                }}
              />
            </div>
            <p className="font-medium">
              {subscriptionName} ({amount}
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
      </Link>

      <TableCell>
        {subscriptionTags.map((tag) => (
          <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
        ))}
      </TableCell>
    </div>
  );
};

export default SubscriptionsTransactionsRow;
