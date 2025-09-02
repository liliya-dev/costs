import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import Tag from '@/components/atoms/Tag/Tag';
import { IPBI, ITag } from '@/types';

import DeletePBI from '../modals/DeletePBI/DeletePBI';
import EditPBI from '../modals/EditPBI/EditPBI';
import PayPBI from '../modals/PayPBI/PayPBI';

import PBIList from './components/PBIList';

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
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

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

  const addSelectedTag = (tag: ITag) => {
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.id === tag.id);
      if (!exists) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const removeSelectedTag = (tag: ITag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

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
        <div className="mb-4 flex justify-between">
          <TableTitle title="All payments by installments" />
        </div>
        <div className="mb-4 h-12 p-2">
          {selectedTags.map((item) => (
            <Tag
              key={item.id}
              label={item.name}
              color={item.color}
              onDismiss={() => removeSelectedTag(item)}
            />
          ))}
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
              handleUpdateSelectedTags={addSelectedTag}
              selectedTags={selectedTags}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PBITable;
