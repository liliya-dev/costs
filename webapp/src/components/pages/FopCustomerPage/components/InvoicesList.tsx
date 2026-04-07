import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols, InvoicesStatusColors } from '@/constants';
import { IFOPInvoice, InvoiceStatus } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  invoices: IFOPInvoice[];
  handleDeleteInvoice: (id: number) => void;
  handleSetPayInvoice: (invoice: IFOPInvoice) => void;
}

const InvoicesList = ({ invoices, handleDeleteInvoice, handleSetPayInvoice }: IProps) => {
  const columns: ColumnDef<IFOPInvoice>[] = [
    {
      key: 'name',
      title: 'Invoice number',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (inv) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: InvoicesStatusColors[inv.status] }}
            />
          </div>
          <p>{inv.name}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      sortable: true,
      sortFn: (a, b) => a.amount - b.amount,
      render: (inv) => `${inv.amount} ${currencySymbols.uah}`,
    },
    {
      key: 'datePaid',
      title: 'Date  paid',
      sortable: true,
      sortFn: (a, b) => {
        if (!a.datePaid && !b.datePaid) return 0;
        if (!a.datePaid) return 1;
        if (!b.datePaid) return -1;
        return new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime();
      },
      render: (inv) => (inv.datePaid ? formatDate(inv.datePaid) : ''),
    },
    {
      key: 'files',
      title: 'Files',
      render: (inv) => (
        <>
          <a href={`${process.env.BASE_URL}/invoices/${inv.id}/download`} download target="_blank">
            Download Invoice
          </a>
          {inv.act && (
            <>
              <br />
              <a
                href={`${process.env.BASE_URL}/work-acts/${inv.act.id}/download`}
                download
                target="_blank"
              >
                Download Act
              </a>
            </>
          )}
        </>
      ),
    },
    {
      key: 'actions',
      title: '',
      render: (inv) => (
        <div className="grid w-28 grid-cols-2">
          {inv.status !== InvoiceStatus.PAID ? (
            <IconButton
              iconHeight={24}
              iconColor="DARK"
              icon="Pay"
              onClick={() => handleSetPayInvoice(inv)}
            />
          ) : (
            <span />
          )}
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => handleDeleteInvoice(inv.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="List of customer invoices"
      data={invoices}
      isLoading={false}
      columns={columns}
      gridCols="grid-cols-3 sm:grid-cols-5"
      rowKey={(inv) => inv.id}
      emptyState={
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          No invoices yet from this customer
        </div>
      }
    />
  );
};

export default InvoicesList;
