import { IPBI, ITag } from '@/types';

import EmptyPBIs from './EmptyPBIs';
import PBIRow from './PBIRow';

interface IProps {
  accountId: number;
  pbis: IPBI[];
  selectedTags: ITag[];
  handleOpenEditPBI: (pbi: IPBI) => void;
  handleOpenDeletePBI: (pbi: IPBI) => void;
  handleOpenPayedPBI: (pbi: IPBI) => void;
  handleUpdateSelectedTags: (tag: ITag) => void;
}

const PBIList = ({
  pbis,
  selectedTags,
  handleOpenDeletePBI,
  handleOpenEditPBI,
  handleOpenPayedPBI,
  accountId,
  handleUpdateSelectedTags,
}: IProps) => {
  const filteredPBIs =
    selectedTags.length > 0
      ? pbis.filter((pbi) =>
          selectedTags.every((selectedTag) => pbi.tags.some((tag) => tag.id === selectedTag.id)),
        )
      : pbis;

  if (!filteredPBIs.length) {
    return <EmptyPBIs />;
  }

  return (
    <>
      {filteredPBIs.map((pbi, index) => (
        <PBIRow
          key={pbi.id}
          pbi={pbi}
          index={index}
          total={filteredPBIs.length}
          accountId={accountId}
          onEdit={handleOpenEditPBI}
          onDelete={handleOpenDeletePBI}
          onPay={handleOpenPayedPBI}
          onTagClick={handleUpdateSelectedTags}
        />
      ))}
    </>
  );
};

export default PBIList;
