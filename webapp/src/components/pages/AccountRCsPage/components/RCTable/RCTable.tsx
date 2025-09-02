import { useCallback, useState } from 'react';

import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import Tag from '@/components/atoms/Tag/Tag';
import { IRC, ITag } from '@/types';

import DeleteRC from '../modals/DeleteRC/DeleteRC';
import EditRC from '../modals/EditRC/EditRC';
import PayRC from '../modals/PayRC/PayRC';

import RCList from './components/RCList';

interface IProps {
  rcs: IRC[];
  isLoading: boolean;
  callback: () => void;
  accountId: number;
}

const headers = ['Name', 'Payment', 'Payment day', 'Permanent?', 'Tags', ''];

const RCTable = ({ rcs, isLoading, callback, accountId }: IProps) => {
  const [editedRC, setEditedRC] = useState<IRC | null>(null);
  const [payedRC, setPayedRC] = useState<IRC | null>(null);
  const [deletedRC, setDeletedRC] = useState<IRC | null>(null);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  const handleOpenPayRC = useCallback((rc: IRC) => setPayedRC(rc), []);
  const handleClosePayRC = useCallback(() => setPayedRC(null), []);

  const handleOpenEditRC = useCallback((rc: IRC) => setEditedRC(rc), []);
  const handleCloseEditRC = useCallback(() => setEditedRC(null), []);

  const handleOpenDeleteRC = useCallback((rc: IRC) => setDeletedRC(rc), []);
  const handleCloseDeleteRC = useCallback(() => setDeletedRC(null), []);

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
      {payedRC && <PayRC handleClose={handleClosePayRC} rc={payedRC} callback={callback} />}
      {deletedRC && (
        <DeleteRC handleClose={handleCloseDeleteRC} rc={deletedRC} callback={callback} />
      )}
      {editedRC && (
        <EditRC
          handleClose={handleCloseEditRC}
          rc={editedRC}
          callback={callback}
          accountId={accountId}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-4 flex justify-between">
          <TableTitle title="All regular costs" />
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
            <RCList
              accountId={accountId}
              rcs={rcs}
              handleOpenPayRC={handleOpenPayRC}
              handleOpenDeleteRC={handleOpenDeleteRC}
              handleOpenEditRC={handleOpenEditRC}
              handleUpdateSelectedTags={addSelectedTag}
              selectedTags={selectedTags}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RCTable;
