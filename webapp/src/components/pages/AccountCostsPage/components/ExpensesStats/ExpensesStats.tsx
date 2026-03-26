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
    return subsTotal + rcTotal + pbiTotal;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {Object.values(Status).map((status) => {
        const total = getTotalByStatus(status);

        return (
          <div key={status} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: StatusColors[status] }}
            >
              <IconComponent color="white" width={24} height={24} />
            </div>
            <div className="mt-6">
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {total.toFixed(2)} {currencySymbols[selectedCurrency]}
              </h4>
              <span className="text-body-sm font-medium">{StatusTexts[status]}</span>
              {status === Status.PAID_IN_PERIOD && totalOtp > 0 && (
                <p className="mt-2 text-body-sm text-gray-600 dark:text-gray-300">
                  + {totalOtp.toFixed(2)} {currencySymbols[selectedCurrency]} from one-time expenses
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpensesStats;
