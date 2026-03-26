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

  const calculateTotal = <
    T extends { amount: number; currency: Currency; rateUahToEur: number; rateUahToUsd: number },
  >(
    items: T[],
  ) =>
    items.reduce(
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

  const totalOtp = calculateTotal(otpTransactions);

  const getTotalByStatus = (status: Status) => {
    const subsTotal = calculateTotal(
      subscriptions.filter((s) =>
        status === Status.PAID_IN_PERIOD
          ? !!s.datePaid
          : status === Status.NOT_PAID
            ? !s.datePaid
            : false,
      ),
    );
    const rcTotal = calculateTotal(rcTransactions.filter((rc) => rc.status === status));
    const pbiTotal = calculateTotal(pbiTransactions.filter((pbi) => pbi.status === status));

    return subsTotal + rcTotal + pbiTotal;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {Object.values(Status)
          .filter((status) => status !== Status.PAID_BEFORE)
          .map((status) => {
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
                      + {totalOtp.toFixed(2)} {currencySymbols[selectedCurrency]} from one-time
                      payments
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <p className="mt-5 text-lg">
        <span className="font-medium">Total paid</span>{' '}
        {(
          getTotalByStatus(Status.PAID_IN_PERIOD) +
          getTotalByStatus(Status.PAID_IN_ADVANCE) +
          totalOtp
        ).toFixed(2)}{' '}
        {currencySymbols[selectedCurrency]}
      </p>
      <p className="mt-2 text-lg">
        <span className="font-medium">Total left to pay</span>{' '}
        {getTotalByStatus(Status.NOT_PAID).toFixed(2)} {currencySymbols[selectedCurrency]}
      </p>
      <p className="mt-2 text-lg">
        <span className="font-medium">Total expenses for current period</span>{' '}
        {(
          getTotalByStatus(Status.PAID_IN_PERIOD) +
          getTotalByStatus(Status.PAID_IN_ADVANCE) +
          getTotalByStatus(Status.NOT_PAID) +
          totalOtp
        ).toFixed(2)}{' '}
        {currencySymbols[selectedCurrency]}
      </p>
    </div>
  );
};

export default ExpensesStats;
