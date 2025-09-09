import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols } from '@/constants';
import { IFOPInvoice } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  invoices: IFOPInvoice[];
}

const headers = ['Invoice number', 'Amount', 'Date  created', 'Date  paid', 'Download'];

const InvoicesList = ({ invoices }: IProps) => {
  return (
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-12">
        <TableTitle title="Current list of made payments" />
      </div>

      {invoices.length === 0 ? (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          No invoices yet from this customer
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="grid grid-cols-3 sm:grid-cols-6">
              {headers.map((item) => (
                <TableHeader key={item} title={item} />
              ))}
            </div>
          </div>
          {invoices.map(
            ({ datePaid, currency, rateUahToEur, rateUahToUsd, amount, dateShouldBePaid }, id) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-6 ${
                  id === payments.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
                }`}
                key={id}
              >
                <TableRow>{amount}</TableRow>
                <TableRow>{currencySymbols[currency]}</TableRow>
                <TableRow>{rateUahToUsd}</TableRow>
                <TableRow>{rateUahToEur}</TableRow>
                <TableRow>{formatDate(datePaid)}</TableRow>
                <TableRow>{formatDate(dateShouldBePaid)}</TableRow>
              </div>
            ),
          )}
        </>
      )}
    </div>
  );
};

export default InvoicesList;
