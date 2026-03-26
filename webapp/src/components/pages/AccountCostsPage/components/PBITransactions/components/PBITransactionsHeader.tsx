import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import { currencySymbols } from '@/constants';
import { Currency } from '@/types';

const headers = [
  'Name',
  'Amount',
  'UAH-USD',
  'UAH-EUR',
  'Date should be paid',
  'Date paid',
  'Tags',
];

interface IProps {
  selectedCurrency: Currency;
}

const PBITransactionsHeader = ({ selectedCurrency }: IProps) => (
  <div className="flex flex-col">
    <div className="grid grid-cols-3 sm:grid-cols-7">
      {headers.map((item) => (
        <TableHeader
          key={item}
          title={item !== 'Amount' ? item : `${item} (${currencySymbols[selectedCurrency]})`}
        />
      ))}
    </div>
  </div>
);

export default PBITransactionsHeader;
