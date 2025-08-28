import { currencySymbols, StatusColors, StatusTexts } from '@/constants';
import { IconType } from '@/icons/svg/icons';
import {
  Currency,
  Status,
  ISubscriptionTransaction,
  RCTransaction,
  IPBITransaction,
  IOTP,
} from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';

interface IProps {
  selectedCurrency: Currency;
  subscriptions: ISubscriptionTransaction[];
  rcTransactions: RCTransaction[];
  pbiTransactions: IPBITransaction[];
  otpTransactions: IOTP[];
}

const ExpensesStats = ({
  selectedCurrency,
  subscriptions,
  rcTransactions,
  pbiTransactions,
  otpTransactions,
}: IProps) => {
  const IconComponent = IconType.Money;

  // Calculate total OTP separately
  const totalOtp = otpTransactions.reduce(
    (sum, { amount, currency, rateUahToEur, rateUahToUsd }) =>
      sum +
      convertAmountToCurrency({
        amount,
        selectedCurrency,
        rateUahToEur,
        rateUahToUsd,
        currency,
      }),
    0,
  );

  const getTotalByStatus = (status: Status) => {
    // Subscriptions
    const subsTotal = subscriptions
      .filter((s) =>
        status === Status.PAID_IN_PERIOD
          ? !!s.datePaid
          : status === Status.NOT_PAID
            ? !s.datePaid
            : false,
      )
      .reduce(
        (sum, { amount, currency, rateUahToEur, rateUahToUsd }) =>
          sum +
          convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          }),
        0,
      );

    // RC Transactions
    const rcTotal = rcTransactions
      .filter((rc) => rc.status === status)
      .reduce(
        (sum, { amount, currency, rateUahToEur, rateUahToUsd }) =>
          sum +
          convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          }),
        0,
      );

    // PBI Transactions
    const pbiTotal = pbiTransactions
      .filter((pbi) => pbi.status === status)
      .reduce(
        (sum, { amount, currency, rateUahToEur, rateUahToUsd }) =>
          sum +
          convertAmountToCurrency({
            amount,
            selectedCurrency,
            rateUahToEur,
            rateUahToUsd,
            currency,
          }),
        0,
      );

    // OTP is NOT included here
    return subsTotal + rcTotal + pbiTotal;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {Object.values(Status).map((status) => (
        <div key={status} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <div
            className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: StatusColors[status] }}
          >
            <IconComponent color="white" width={24} height={24} />
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {getTotalByStatus(status).toFixed(2)}
              </h4>
              <span className="text-body-sm font-medium">
                {StatusTexts[status]}{' '}
                {status === Status.PAID_IN_PERIOD &&
                  totalOtp > 0 &&
                  ` and ${totalOtp} ${currencySymbols[selectedCurrency]} one time payments`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensesStats;
