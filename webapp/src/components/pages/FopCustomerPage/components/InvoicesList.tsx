import IconButton from '@/components/atoms/IconButton/IconButton';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols, InvoicesStatusColors } from '@/constants';
import { IFOPInvoice } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  invoices: IFOPInvoice[];
  handleDeleteInvoice: (id: number) => void;
}

const headers = ['Invoice number', 'Amount', 'Date  paid', 'Files'];

const InvoicesList = ({ invoices, handleDeleteInvoice }: IProps) => {
  return (
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-12">
        <TableTitle title="List of customer invoices" />
      </div>

      {invoices.length === 0 ? (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          No invoices yet from this customer
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="grid grid-cols-3 sm:grid-cols-5">
              {headers.map((item) => (
                <TableHeader key={item} title={item} />
              ))}
            </div>
          </div>
          {invoices.map(({ datePaid, name, amount, id, status, act }, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                index === invoices.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
              }`}
              key={id}
            >
              <TableRow>
                <div className="flex">
                  <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: InvoicesStatusColors[status] }}
                    />
                  </div>
                  <p>{`${name}`}</p>
                </div>
              </TableRow>
              <TableRow>{`${amount} ${currencySymbols.uah}`}</TableRow>
              <TableRow>{datePaid ? formatDate(datePaid) : ''}</TableRow>
              <TableRow>
                <a
                  href={`${process.env.BASE_URL}/invoices/${id}/download`}
                  download
                  target="_blank"
                >
                  Download Invoice
                </a>
                <br />
                {act && (
                  <a
                    href={`${process.env.BASE_URL}/work-acts/${act.id}/download`}
                    download
                    target="_blank"
                  >
                    Download Act
                  </a>
                )}
              </TableRow>
              <TableRow>
                <IconButton
                  iconHeight={24}
                  iconColor="RED"
                  icon="Trash"
                  onClick={() => handleDeleteInvoice(id)}
                />
              </TableRow>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InvoicesList;
