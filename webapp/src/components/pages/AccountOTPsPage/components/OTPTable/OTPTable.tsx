import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import DataTable, { ColumnDef } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IOTP, ITag } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

import DeleteOTP from '../modals/DeleteOTP/DeleteOTP';
import EditOTP from '../modals/EditOTP/EditOTP';

import OTPTags from './components/OTPTags';
import EmptyOTPs from './components/EmptyOTPs';

interface IProps {
  otps: IOTP[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const OTPTable = ({ otps, isLoading, callback, accountId }: IProps) => {
  const [editedOTP, setEditedOTP] = useState<IOTP | null>(null);
  const [deletedOTP, setDeletedOTP] = useState<IOTP | null>(null);

  const columns: ColumnDef<IOTP>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
      render: (otp) => <p className="font-medium">{otp.name}</p>,
    },
    {
      key: 'amount',
      title: 'Amount',
      sortable: true,
      sortFn: (a, b) => a.amount - b.amount,
      render: (otp) => `${otp.amount} ${currencySymbols[otp.currency]}`,
    },
    {
      key: 'datePaid',
      title: 'Date Paid',
      sortable: true,
      sortFn: (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime(),
      render: (otp) => formatDate(otp.datePaid),
    },
    {
      key: 'description',
      title: 'Description',
      render: (otp) => otp.description,
    },
    {
      key: 'tags',
      title: 'Tags',
      linked: false,
      render: (otp, onTagClick) => <OTPTags tags={otp.tags} onTagClick={onTagClick} />,
    },
    {
      key: 'actions',
      title: '',
      linked: false,
      render: (otp) => (
        <div className="flex w-full justify-end">
          <IconButton
            iconHeight={24}
            iconColor="LIGHT"
            icon="Edit"
            onClick={() => setEditedOTP(otp)}
          />
          <div className="ml-4" />
          <IconButton
            iconHeight={24}
            iconColor="RED"
            icon="Trash"
            onClick={() => setDeletedOTP(otp)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {deletedOTP && (
        <DeleteOTP callback={callback} otp={deletedOTP} handleClose={() => setDeletedOTP(null)} />
      )}
      {editedOTP && (
        <EditOTP
          accountId={accountId}
          otp={editedOTP}
          callback={callback}
          handleClose={() => setEditedOTP(null)}
        />
      )}
      <DataTable
        title="All one time payments"
        data={otps}
        isLoading={isLoading}
        columns={columns}
        gridCols="grid-cols-3 sm:grid-cols-6"
        rowKey={(otp) => otp.id}
        enableTagFilter
        searchable
        searchPlaceholder="Search by name..."
        getSearchableText={(otp) => otp.name}
        emptyState={<EmptyOTPs />}
      />
    </>
  );
};

export default OTPTable;
