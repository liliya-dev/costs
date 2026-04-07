import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IOTI, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import DeleteOTITransaction from './components/modals/DeleteOTITransaction/DeleteOTITransaction';
import EditOTITransaction from './components/modals/EditOTITransaction/EditOTITransaction';

interface IProps {
  otis: IOTI[];
  isLoading: boolean;
  selectedCurrency: Currency;
  handleDataReload: () => void;
}

const OtiTable = ({ otis, isLoading, selectedCurrency, handleDataReload }: IProps) => {
  const [editedOti, setEditedOti] = useState<IOTI | null>(null);
  const [deletedOti, setDeletedOti] = useState<IOTI | null>(null);

  const columns: ColumnDef<IOTI>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (oti) => `${oti.name} (${oti.amount}${currencySymbols[oti.currency]})`,
    },
    {
      key: 'amount',
      title: `Amount (${currencySymbols[selectedCurrency]})`,
      sortable: true,
      sortFn: (a, b) => a.amount - b.amount,
      render: (oti) =>
        convertAmountToCurrency({
          amount: oti.amount,
          selectedCurrency,
          rateUahToEur: oti.rateUahToEur,
          rateUahToUsd: oti.rateUahToUsd,
          currency: oti.currency,
        }),
    },
    {
      key: 'uahUsd',
      title: 'UAH-USD',
      render: (oti) => oti.rateUahToUsd,
    },
    {
      key: 'uahEur',
      title: 'UAH_EUR',
      render: (oti) => oti.rateUahToEur,
    },
    {
      key: 'datePaid',
      title: 'Date paid',
      sortable: true,
      sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
      render: (oti) => formatDate(oti.datePaid),
    },
    {
      key: 'description',
      title: 'Description',
      render: (oti) => oti.description,
    },
    {
      key: 'actions',
      title: '',
      render: (oti) => (
        <div className="flex w-full justify-end">
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => setEditedOti(oti)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => setDeletedOti(oti)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {deletedOti && (
        <DeleteOTITransaction
          oti={deletedOti}
          handleClose={() => setDeletedOti(null)}
          callback={handleDataReload}
        />
      )}
      {editedOti && (
        <EditOTITransaction
          oti={editedOti}
          handleClose={() => setEditedOti(null)}
          callback={handleDataReload}
        />
      )}
      <DataTable
        title="One time income payments in the current period"
        data={otis}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-7"
        rowKey={(oti) => oti.id}
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(oti) => oti.name}
        emptyState={
          <div className="bg-white px-6 py-12">
            <p className="text-center text-lg">
              There are no one time income payments in this period
            </p>
          </div>
        }
      />
    </>
  );
};

export default OtiTable;
