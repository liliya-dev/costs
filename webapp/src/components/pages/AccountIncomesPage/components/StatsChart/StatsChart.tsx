import RoundedChart from '@/components/atoms/Charts/RoundedChart';
import { StatusColors, StatusTexts } from '@/constants';
import { IIRP, Currency, Status } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';

interface IProps {
  selectedCurrency: Currency;
  irps: IIRP[];
}

const StatsChart = ({ selectedCurrency, irps }: IProps) => {
  return (
    <div className="col-span-6">
      <RoundedChart
        total={
          +irps
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
            )
            .toFixed(2)
        }
        title="Income payments"
        labels={Object.values(Status).map((status) => StatusTexts[status])}
        colors={Object.values(Status).map((status) => StatusColors[status])}
        items={Object.values(Status).map((status) => {
          const total = irps
            .filter((irp) => irp.status === status)
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
          return { name: status, value: total };
        })}
      />
    </div>
  );
};

export default StatsChart;
