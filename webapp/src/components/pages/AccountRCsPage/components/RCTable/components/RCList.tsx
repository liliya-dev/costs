import { IRC, ITag } from '@/types';

import EmptyRCs from './EmptyRCs';
import RCRow from './RCRow';

interface IProps {
  accountId: number;
  rcs: IRC[];
  handleOpenEditRC: (rc: IRC) => void;
  handleOpenDeleteRC: (rc: IRC) => void;
  handleOpenPayRC: (rc: IRC) => void;
  handleUpdateSelectedTags: (tag: ITag) => void;
  selectedTags: ITag[];
}

const RCList = ({
  rcs,
  handleOpenDeleteRC,
  handleOpenEditRC,
  handleOpenPayRC,
  handleUpdateSelectedTags,
  selectedTags,
  accountId,
}: IProps) => {
  const filteredRCs =
    selectedTags.length > 0
      ? rcs.filter((rc) =>
          selectedTags.every((selectedTag) => rc.tags.some((tag) => tag.id === selectedTag.id)),
        )
      : rcs;

  if (!filteredRCs.length) return <EmptyRCs />;

  return (
    <>
      {filteredRCs.map((rc, index) => (
        <RCRow
          key={rc.id}
          rc={rc}
          index={index}
          total={filteredRCs.length}
          accountId={accountId}
          onPay={handleOpenPayRC}
          onEdit={handleOpenEditRC}
          onDelete={handleOpenDeleteRC}
          onTagClick={handleUpdateSelectedTags}
        />
      ))}
    </>
  );
};

export default RCList;
