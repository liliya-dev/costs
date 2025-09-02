import Link from 'next/link';

import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols, StatusColors } from '@/constants';
import { Currency, ISubscriptionTransaction } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  accountId: number;
  subscription: ISubscriptionTransaction;
  isLast: boolean;
  selectedCurrency: Currency;
}

const SubscriptionsTransactionsRow = ({
  subscription,
  accountId,
  isLast,
  selectedCurrency,
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
    <Link href={`/account/${accountId}/costs/subscriptions/${subscriptionId}`} className="contents">
      <div
        className={`grid cursor-pointer grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-6 ${
          isLast ? '' : 'border-b border-stroke dark:border-dark-3'
        }`}
      >
        <TableRow>
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
        </TableRow>
        <TableRow>
          {convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          })}
        </TableRow>
        <TableRow>{rateUahToUsd}</TableRow>
        <TableRow>{rateUahToEur}</TableRow>
        <TableRow>{formatDate(dateShouldBePaid)}</TableRow>
        <TableRow>
          {subscriptionTags.map((item) => (
            <Tag key={item.id} label={item.name} color={item.color} />
          ))}
        </TableRow>
      </div>
    </Link>
  );
};

export default SubscriptionsTransactionsRow;
