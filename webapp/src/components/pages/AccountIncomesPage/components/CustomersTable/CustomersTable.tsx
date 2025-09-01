import { useCallback, useEffect, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import LegendItem from '@/components/atoms/LegendItem/LegendItem';
import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols, StatusColors, StatusTexts } from '@/constants';
import { Currency, ICustomer, IIRP, Status } from '@/types';

import IRPsList from './components/IRPsList/IRPsList';
import DeleteIRPTransaction from './components/modals/DeleteIRPTransaction/DeleteIRPTransaction';
import EditIRPTransaction from './components/modals/EditIRPTransaction/EditIRPTransaction';

interface IProps {
  irps: IIRP[];
  isLoading: boolean;
  selectedCurrency: Currency;
  customers: ICustomer[];
  handleDataReload: () => void;
  accountId: number;
}

const headers = ['Name', 'Amount', 'UAH-USD', 'UAH_EUR', 'Date paid', 'Date should be paid'];
const defaultStatus = { label: 'ALL', id: 'all' };

const CustomersTable = ({
  irps,
  isLoading,
  selectedCurrency,
  customers,
  handleDataReload,
  accountId,
}: IProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const handleChangeStatus = (status: Status | null) => setSelectedStatus(status);
  const [filteredIrps, setFilteredIrps] = useState<IIRP[]>(irps);
  const [editedIrp, setEditedIrp] = useState<IIRP | null>(null);
  const [deletedIrp, setDelitedIrp] = useState<IIRP | null>(null);

  useEffect(() => {
    const filtered = irps.filter((irp) => (selectedStatus ? irp.status === selectedStatus : irp));
    setFilteredIrps(filtered);
  }, [selectedStatus, irps]);

  const onStatusSelect = (item: { label: string; id: string }) => {
    const status = item.id as Status;
    if (Object.values(Status).includes(status)) {
      handleChangeStatus(status);
    } else {
      handleChangeStatus(null);
    }
  };

  const handleOpenEditIRP = useCallback((irp: IIRP) => {
    setEditedIrp(irp);
  }, []);

  const handleCloseEditIRP = useCallback(() => {
    setEditedIrp(null);
  }, []);

  const handleOpenDeleteIRP = useCallback((irp: IIRP) => {
    setDelitedIrp(irp);
  }, []);

  const handleCloseDeleteIRP = useCallback(() => {
    setDelitedIrp(null);
  }, []);

  return (
    <>
      {editedIrp && editedIrp.transactionId && (
        <EditIRPTransaction
          transactionId={editedIrp.transactionId}
          customers={customers}
          handleClose={handleCloseEditIRP}
          callback={handleDataReload}
        />
      )}
      {deletedIrp && deletedIrp.transactionId && (
        <DeleteIRPTransaction
          transactionId={deletedIrp.transactionId}
          handleClose={handleCloseDeleteIRP}
          callback={handleDataReload}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="Income Payments in current period" />
          <Dropdown
            placeholder="Choose payments to display"
            selectedItem={
              [
                defaultStatus,
                ...Object.values(Status).map((item) => ({ label: StatusTexts[item], id: item })),
              ].find((item) => item.id === selectedStatus) || defaultStatus
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onSelect={onStatusSelect}
            items={[
              { label: 'ALL', id: 'all' },
              ...Object.values(Status).map((item) => ({ label: StatusTexts[item], id: item })),
            ]}
          />
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-7">
            {headers.map((item) => (
              <TableHeader
                key={item}
                title={item !== 'Amount' ? item : `${item} (${currencySymbols[selectedCurrency]})`}
              />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <IRPsList
              irps={filteredIrps}
              selectedCurrency={selectedCurrency}
              handleOpenDeleteIRP={handleOpenDeleteIRP}
              handleOpenEditIRP={handleOpenEditIRP}
              accountId={accountId}
            />
          )}
        </div>
        <div className="flex justify-end pt-4">
          {Object.values(Status).map((item) => (
            <LegendItem key={item} color={StatusColors[item]} text={StatusTexts[item]} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomersTable;
