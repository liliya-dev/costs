import { useCallback, useState } from 'react';

import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import LegendItem from '@/components/atoms/LegendItem/LegendItem';
import { currencySymbols, StatusColors, StatusTexts } from '@/constants';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';
import { Currency, ICustomer, IIRP, Status } from '@/types';

import DeleteIRPTransaction from './components/modals/DeleteIRPTransaction/DeleteIRPTransaction';
import EditIRPTransaction from './components/modals/EditIRPTransaction/EditIRPTransaction';
import IconButton from '@/components/atoms/IconButton/IconButton';

interface IProps {
  irps: IIRP[];
  isLoading: boolean;
  selectedCurrency: Currency;
  customers: ICustomer[];
  handleDataReload: () => void;
  accountId: number;
}

const STATUS_ORDER = [
  Status.PAID_IN_PERIOD,
  Status.PAID_BEFORE,
  Status.PAID_IN_ADVANCE,
  Status.NOT_PAID,
];

const statusOptions = [
  { id: 'all', label: 'ALL' },
  ...Object.values(Status).map((s) => ({ id: s, label: StatusTexts[s] })),
];

const CustomersTable = ({
  irps,
  isLoading,
  selectedCurrency,
  customers,
  handleDataReload,
  accountId,
}: IProps) => {
  const [editedIrp, setEditedIrp] = useState<IIRP | null>(null);
  const [deletedIrp, setDeletedIrp] = useState<IIRP | null>(null);

  const columns: ColumnDef<IIRP>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.customerName.localeCompare(b.customerName),
      render: (irp) => (
        <div className="flex">
          <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: StatusColors[irp.status] }}
            />
          </div>
          <p className="font-medium">
            {irp.customerName} (
            {Number.isInteger(irp.amount) ? irp.amount.toString() : irp.amount.toFixed(2)}
            {currencySymbols[irp.currency]})
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: `Amount (${currencySymbols[selectedCurrency]})`,
      sortable: true,
      sortFn: (a, b) => a.amount - b.amount,
      render: (irp) =>
        convertAmountToCurrency({
          amount: irp.amount,
          selectedCurrency,
          rateUahToEur: irp.rateUahToEur,
          rateUahToUsd: irp.rateUahToUsd,
          currency: irp.currency,
        }),
    },
    {
      key: 'uahUsd',
      title: 'UAH-USD',
      render: (irp) => irp.rateUahToUsd,
    },
    {
      key: 'uahEur',
      title: 'UAH_EUR',
      render: (irp) => irp.rateUahToEur,
    },
    {
      key: 'datePaid',
      title: 'Date paid',
      sortable: true,
      sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
      render: (irp) => formatDate(irp.datePaid),
    },
    {
      key: 'dateShouldBePaid',
      title: 'Date should be paid',
      sortable: true,
      sortFn: (a, b) =>
        new Date(a.dateShouldBePaid).getTime() - new Date(b.dateShouldBePaid).getTime(),
      render: (irp) => formatDate(irp.dateShouldBePaid),
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (irp) =>
        irp.datePaid ? (
          <div className="flex w-full justify-end">
            <IconButton
              iconHeight={24}
              iconColor="LIGHT"
              icon="Edit"
              onClick={() => setEditedIrp(irp)}
            />
            <div className="ml-4" />
            <IconButton
              iconHeight={24}
              iconColor="RED"
              icon="Trash"
              onClick={() => setDeletedIrp(irp)}
            />
          </div>
        ) : null,
    },
  ];

  return (
    <>
      {editedIrp && editedIrp.transactionId && (
        <EditIRPTransaction
          transactionId={editedIrp.transactionId}
          customers={customers}
          handleClose={() => setEditedIrp(null)}
          callback={handleDataReload}
        />
      )}
      {deletedIrp && deletedIrp.transactionId && (
        <DeleteIRPTransaction
          transactionId={deletedIrp.transactionId}
          handleClose={() => setDeletedIrp(null)}
          callback={handleDataReload}
        />
      )}
      <DataTable
        title="Income Payments in current period"
        data={irps}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-7"
        rowKey={(irp, ) => `${irp.customerId}-${irp.dateShouldBePaid}`}
        getRowHref={(irp) => `/account/${accountId}/customers/${irp.customerId}`}
        searchable
        searchPlaceholder="Search by customer name..."
        getSearchableText={(irp) => irp.customerName}
        statusFilter={{
          title: 'Payment status',
          options: statusOptions,
          defaultValue: 'all',
          filterFn: (irp, value) => (value === 'all' ? true : irp.status === value),
        }}
        defaultSort={{ key: 'dateShouldBePaid', direction: 'asc' }}
        footer={
          <div className="flex justify-end">
            {Object.values(Status).map((s) => (
              <LegendItem key={s} color={StatusColors[s]} text={StatusTexts[s]} />
            ))}
          </div>
        }
      />
    </>
  );
};

export default CustomersTable;
