import Tag from '@/components/atoms/Tag/Tag';
import { ITag } from '@/types';

interface IProps {
  selectedTags: ITag[];
  removeSelectedTag: (tag: ITag) => void;
}

const SelectedTags = ({ selectedTags, removeSelectedTag }: IProps) => {
  return (
    <div className="mt-4 flex h-12 flex-wrap gap-2 p-2">
      {selectedTags.map((item) => (
        <Tag
          key={item.id}
          label={item.name}
          color={item.color}
          onDismiss={() => removeSelectedTag(item)}
        />
      ))}
    </div>
  );
};

export default SelectedTags;
