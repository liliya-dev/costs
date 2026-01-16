import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols } from '@/constants';
import { IOTP, Currency, ITag } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  transaction: IOTP;
  selectedCurrency: Currency;
  isLast: boolean;
  onTagClick: (tag: ITag) => void;
}

const OTPTransactionRow = ({ transaction, selectedCurrency, isLast, onTagClick }: IProps) => {
  const { amount, currency, rateUahToEur, rateUahToUsd, datePaid, name, description, id, tags } =
    transaction;

  return (
    <div
      className={`grid grid-cols-3 transition-opacity duration-200 hover:bg-gray-50 hover:opacity-80 dark:hover:bg-gray-800 sm:grid-cols-7 ${
        isLast ? '' : 'border-b border-stroke dark:border-dark-3'
      }`}
      key={id}
    >
      <TableRow>
        <p className="font-medium">
          {name} ({amount}
          {currencySymbols[currency]})
        </p>
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
      <TableRow>{formatDate(datePaid)}</TableRow>
      <TableRow>{description}</TableRow>
      <TableRow>
        {tags.map((tag) => (
          <Tag key={tag.id} label={tag.name} color={tag.color} onClick={() => onTagClick(tag)} />
        ))}
      </TableRow>
    </div>
  );
};

export default OTPTransactionRow;
