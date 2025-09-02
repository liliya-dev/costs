import Tag from '@/components/atoms/Tag/Tag';
import { ITag } from '@/types';

interface IProps {
  tags: ITag[];
  onTagClick?: (tag: ITag) => void;
}

const OTPTags = ({ tags, onTagClick }: IProps) => (
  <>
    {tags.map((tag) => (
      <Tag
        key={tag.id}
        label={tag.name}
        color={tag.color}
        onClick={onTagClick ? () => onTagClick(tag) : undefined}
      />
    ))}
  </>
);

export default OTPTags;
