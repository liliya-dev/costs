import { IRC, ITag } from '@/types';

import EmptyRCs from './EmptyRCs';
import RCRow from './RCRow';

interface IProps {
  accountId: number;
  rcs: IRC[];
  handleOpenEditRC: (rc: IRC) => void;
  handleOpenDeleteRC: (rc: IRC) => void;
  handleOpenPayRC: (rc: IRC) => void;
  onTagClick: (tag: ITag) => void;
}

const RCList = ({
  rcs,
  handleOpenDeleteRC,
  handleOpenEditRC,
  handleOpenPayRC,
  onTagClick,
  accountId,
}: IProps) => {
  if (!rcs.length) return <EmptyRCs />;

  return (
    <>
      {rcs.map((rc, index) => (
        <RCRow
          key={rc.id}
          rc={rc}
          index={index}
          total={rcs.length}
          accountId={accountId}
          onPay={handleOpenPayRC}
          onEdit={handleOpenEditRC}
          onDelete={handleOpenDeleteRC}
          onTagClick={onTagClick}
        />
      ))}
    </>
  );
};

export default RCList;
