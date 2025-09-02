import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import { currencySymbols } from '@/constants';
import { Currency } from '@/types';

const headers = ['Name', 'Amount', 'UAH-USD', 'UAH-EUR', 'Tags', 'Date should be paid'];

interface IProps {
  selectedCurrency: Currency;
}

const SubscriptionsTransactionsHeader = ({ selectedCurrency }: IProps) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 sm:grid-cols-6">
        {headers.map((item) => (
          <TableHeader
            key={item}
            title={item !== 'Amount' ? item : `${item} (${currencySymbols[selectedCurrency]})`}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsTransactionsHeader;
