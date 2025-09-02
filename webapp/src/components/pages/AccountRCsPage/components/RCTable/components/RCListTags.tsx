import Tag from '@/components/atoms/Tag/Tag';
import { ITag } from '@/types';

interface IProps {
  tags: ITag[];
  onTagClick: (tag: ITag) => void;
}

const RCListTags = ({ tags, onTagClick }: IProps) => (
  <>
    {tags.map((item) => (
      <Tag key={item.id} label={item.name} color={item.color} onClick={() => onTagClick(item)} />
    ))}
  </>
);

export default RCListTags;
