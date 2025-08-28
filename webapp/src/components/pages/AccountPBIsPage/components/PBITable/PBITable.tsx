import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { IPBI } from '@/types';

import DeletePBI from '../modals/DeletePBI/DeletePBI';
import EditPBI from '../modals/EditPBI/EditPBI';
import PayPBI from '../modals/PayPBI/PayPBI';

import PBIList from './components/PBIList/PBIList';

interface IProps {
  pbis: IPBI[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = ['Name', 'Payment', 'Payments done', 'Payment day', 'Tags', ''];

const PBITable = ({ pbis, isLoading, callback, accountId }: IProps) => {
  const [payedPBI, setPayedPBI] = useState<IPBI | null>(null);
  const [editedPBI, setEditedPBI] = useState<IPBI | null>(null);
  const [deletedPBI, setDeletedPBI] = useState<IPBI | null>(null);

  const handleOpenPayedPBI = useCallback((pbi: IPBI) => {
    setPayedPBI(pbi);
  }, []);

  const handleClosePayedPBI = useCallback(() => {
    setPayedPBI(null);
  }, []);

  const handleOpenEditPBI = useCallback((pbi: IPBI) => {
    setEditedPBI(pbi);
  }, []);

  const handleCloseEditPBI = useCallback(() => {
    setEditedPBI(null);
  }, []);

  const handleOpenDeletePBI = useCallback((pbi: IPBI) => {
    setDeletedPBI(pbi);
  }, []);

  const handleCloseDeletePBI = useCallback(() => {
    setDeletedPBI(null);
  }, []);

  return (
    <>
      {deletedPBI && (
        <DeletePBI callback={callback} pbi={deletedPBI} handleClose={handleCloseDeletePBI} />
      )}
      {editedPBI && (
        <EditPBI
          accountId={accountId}
          pbi={editedPBI}
          callback={callback}
          handleClose={handleCloseEditPBI}
        />
      )}
      {payedPBI && <PayPBI pbi={payedPBI} callback={callback} handleClose={handleClosePayedPBI} />}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="All payments by installments" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {headers.map((item) => (
              <TableHeader key={item} title={item} />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <PBIList
              pbis={pbis}
              accountId={accountId}
              handleOpenDeletePBI={handleOpenDeletePBI}
              handleOpenEditPBI={handleOpenEditPBI}
              handleOpenPayedPBI={handleOpenPayedPBI}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PBITable;
