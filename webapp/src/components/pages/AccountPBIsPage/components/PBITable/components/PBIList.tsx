import { IPBI, ITag } from '@/types';

import EmptyPBIs from './EmptyPBIs';
import PBIRow from './PBIRow';

interface IProps {
  accountId: number;
  pbis: IPBI[];
  handleOpenEditPBI: (pbi: IPBI) => void;
  handleOpenDeletePBI: (pbi: IPBI) => void;
  handleOpenPayedPBI: (pbi: IPBI) => void;
  onTagClick: (tag: ITag) => void;
}

const PBIList = ({
  pbis,
  handleOpenDeletePBI,
  handleOpenEditPBI,
  handleOpenPayedPBI,
  accountId,
  onTagClick,
}: IProps) => {
  if (!pbis.length) return <EmptyPBIs />;

  return (
    <>
      {pbis.map((pbi, index) => (
        <PBIRow
          key={pbi.id}
          pbi={pbi}
          index={index}
          total={pbis.length}
          accountId={accountId}
          onEdit={handleOpenEditPBI}
          onDelete={handleOpenDeletePBI}
          onPay={handleOpenPayedPBI}
          onTagClick={onTagClick}
        />
      ))}
    </>
  );
};

export default PBIList;
